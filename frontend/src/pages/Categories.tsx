import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import {
    Plus, Edit2, Trash2, FolderOpen,
    ArrowUpDown, Tag as TagIcon, Utensils, Car, ShoppingCart, Film, Zap, TrendingUp, Briefcase,
    Heart, PiggyBank, Ticket, Package, PawPrint, Home, Gift, Dumbbell, BookOpen, ShoppingBag, Book, Receipt
} from 'lucide-react';
import Modal from '../components/Modal';
import { Button, Input, Tag } from '../components/ui';
import type { TagColor } from '../components/ui';
import { GET_CATEGORIES, GET_TRANSACTIONS } from '../graphql/queries';
import { CREATE_CATEGORY, UPDATE_CATEGORY, DELETE_CATEGORY } from '../graphql/mutations';

interface Category {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    createdAt: string;
}

interface Transaction {
    id: string;
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    category: {
        id: string;
        name: string;
    };
}

interface GetCategoriesData {
    categories: Category[];
}

interface GetTransactionsData {
    transactions: Transaction[];
}

// Map string names to Lucide icons
const iconMap: Record<string, any> = {
    Briefcase, Car, Heart, PiggyBank, ShoppingCart, Ticket, Package, Utensils,
    PawPrint, Home, Gift, Dumbbell, BookOpen, ShoppingBag, Book, Receipt,
    Film, Zap, TrendingUp, Plus, TagIcon
};

const AVAILABLE_ICONS = [
    'Briefcase', 'Car', 'Heart', 'PiggyBank', 'ShoppingCart', 'Ticket', 'Package', 'Utensils',
    'PawPrint', 'Home', 'Gift', 'Dumbbell', 'BookOpen', 'ShoppingBag', 'Book', 'Receipt'
];

const AVAILABLE_COLORS: TagColor[] = [
    'green', 'blue', 'purple', 'pink', 'red', 'orange', 'yellow'
];

const getCategoryStyle = (category: Category): { color: TagColor, icon: any, desc: string } => {
    if (category.icon && category.color) {
        return {
            color: category.color as TagColor,
            icon: iconMap[category.icon] || TagIcon,
            desc: category.description || 'Categoria customizada'
        };
    }

    const name = category.name.toLowerCase();
    if (name.includes('alimentação') || name.includes('restaurante')) return { color: 'blue', icon: Utensils, desc: 'Restaurantes, delivery e refeições' };
    if (name.includes('transporte') || name.includes('carro') || name.includes('gasolina')) return { color: 'purple', icon: Car, desc: 'Gasolina, transporte público e viagens' };
    if (name.includes('mercado') || name.includes('compras')) return { color: 'orange', icon: ShoppingCart, desc: 'Compras de supermercado e mantimentos' };
    if (name.includes('entretenimento') || name.includes('cinema')) return { color: 'pink', icon: Film, desc: 'Cinema, jogos e lazer' };
    if (name.includes('utilidades') || name.includes('aluguel') || name.includes('contas')) return { color: 'yellow', icon: Zap, desc: 'Energia, água, internet e telefone' };
    if (name.includes('salário') || name.includes('freelance')) return { color: 'green', icon: Briefcase, desc: 'Renda mensal e bonificações' };
    if (name.includes('saúde') || name.includes('saude')) return { color: 'red', icon: Plus, desc: 'Medicamentos, consultas e exames' };
    if (name.includes('investimento')) return { color: 'green', icon: TrendingUp, desc: 'Aplicações e retornos financeiros' };
    return { color: 'gray', icon: TagIcon, desc: 'Outras transações financeiras' };
};

export default function Categories() {
    const { data: catData, loading: catLoading, error: catError, refetch: refetchCat } = useQuery<GetCategoriesData>(GET_CATEGORIES);
    const { data: txData, loading: txLoading, refetch: refetchTx } = useQuery<GetTransactionsData>(GET_TRANSACTIONS);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('Briefcase');
    const [selectedColor, setSelectedColor] = useState<TagColor>('green');

    const [createCategory] = useMutation(CREATE_CATEGORY, {
        onCompleted: () => {
            refetchCat();
            closeModal();
        }
    });

    const [updateCategory] = useMutation(UPDATE_CATEGORY, {
        onCompleted: () => {
            refetchCat();
            refetchTx();
            closeModal();
        }
    });

    const [deleteCategory] = useMutation(DELETE_CATEGORY, {
        onCompleted: () => {
            refetchCat();
            refetchTx();
        }
    });

    const openCreateModal = () => {
        setEditingCategory(null);
        setName('');
        setDescription('');
        setSelectedIcon('Briefcase');
        setSelectedColor('green');
        setIsModalOpen(true);
    };

    const openEditModal = (category: Category) => {
        setEditingCategory(category);
        setName(category.name);
        setDescription(category.description || '');
        setSelectedIcon(category.icon || 'Briefcase');
        setSelectedColor((category.color as TagColor) || 'green');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const vars = {
            name,
            description,
            icon: selectedIcon,
            color: selectedColor
        };

        if (editingCategory) {
            await updateCategory({ variables: { id: editingCategory.id, ...vars } });
        } else {
            await createCategory({ variables: vars });
        }
    };

    const handleDelete = async (id: string, count: number) => {
        if (count > 0) {
            alert(`Você não pode excluir esta categoria pois ela possui ${count} transações associadas. Mude as transações de categoria primeiro.`);
            return;
        }
        if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
            await deleteCategory({ variables: { id } });
        }
    };

    if (catLoading || txLoading) return <div className="container" style={{ paddingTop: '40px' }}>Carregando categorias...</div>;
    if (catError) return <div className="container" style={{ padding: '40px', color: 'var(--error)' }}>Erro ao carregar categorias: {catError.message}</div>;

    const categories = catData?.categories || [];
    const transactions = txData?.transactions || [];

    // Calculate dynamic stats
    const totalCategories = categories.length;
    const totalTransactions = transactions.length;

    const categoryCounts: Record<string, { count: number, name: string, cat: Category | null }> = {};
    categories.forEach(cat => {
        categoryCounts[cat.id] = { count: 0, name: cat.name, cat: cat };
    });

    transactions.forEach(tx => {
        if (categoryCounts[tx.category.id]) {
            categoryCounts[tx.category.id].count += 1;
        }
    });

    let mostUsedCategoryData = { name: '-', count: -1, cat: null as Category | null };
    Object.values(categoryCounts).forEach(cat => {
        if (cat.count > mostUsedCategoryData.count) {
            mostUsedCategoryData = cat;
        }
    });

    const mostUsedStyle = mostUsedCategoryData.cat ? getCategoryStyle(mostUsedCategoryData.cat) : null;
    const MostUsedIcon = mostUsedStyle ? mostUsedStyle.icon : TagIcon;

    return (
        <div style={{ paddingBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>Categorias</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Organize suas transações por categorias</p>
                </div>
                <Button variant="primary" onClick={openCreateModal} icon={<Plus size={18} />}>
                    Nova categoria
                </Button>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
                <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--bg-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                        <TagIcon size={24} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 4px 0' }}>{totalCategories}</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>TOTAL DE CATEGORIAS</p>
                    </div>
                </div>

                <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
                        <ArrowUpDown size={24} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 4px 0' }}>{totalTransactions}</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>TOTAL DE TRANSAÇÕES</p>
                    </div>
                </div>

                <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                        <MostUsedIcon size={24} style={{ color: mostUsedStyle ? (mostUsedStyle.color === 'blue' ? '#3b82f6' : (mostUsedStyle.color === 'green' ? 'var(--success)' : 'inherit')) : 'inherit' }} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 4px 0' }}>{mostUsedCategoryData.name}</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>CATEGORIA MAIS UTILIZADA</p>
                    </div>
                </div>
            </div>

            {/* Categories Grid */}
            {categories.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '64px 0', color: 'var(--text-muted)' }}>
                    <FolderOpen size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                    <p>Nenhuma categoria encontrada. Crie sua primeira categoria.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {categories.map((cat) => {
                        const style = getCategoryStyle(cat);
                        const IconComponent = style.icon;
                        const count = categoryCounts[cat.id]?.count || 0;

                        return (
                            <div key={cat.id} className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--bg-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <IconComponent size={20} style={{ color: style.color === 'green' ? 'var(--success)' : (style.color === 'blue' ? '#3b82f6' : (style.color === 'red' ? 'var(--error)' : 'var(--text-secondary)')) }} />
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button className="btn btn-secondary" style={{ padding: '6px', border: '1px solid var(--border-color)', borderRadius: '6px' }} onClick={() => handleDelete(cat.id, count)} aria-label="Excluir">
                                            <Trash2 size={16} color="var(--error)" />
                                        </button>
                                        <button className="btn btn-secondary" style={{ padding: '6px', border: '1px solid var(--border-color)', borderRadius: '6px' }} onClick={() => openEditModal(cat)} aria-label="Editar">
                                            <Edit2 size={16} color="var(--text-secondary)" />
                                        </button>
                                    </div>
                                </div>

                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 8px 0' }}>{cat.name}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0, lineHeight: 1.5 }}>
                                        {style.desc}
                                    </p>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px' }}>
                                    <Tag color={style.color}>{cat.name}</Tag>
                                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                                        {count} {count === 1 ? 'item' : 'itens'}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={editingCategory ? 'Editar categoria' : 'Nova categoria'}
            >
                <form onSubmit={handleSubmit}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '-12px', marginBottom: '24px' }}>
                        Organize suas transações com categorias
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <Input
                            label="Título"
                            placeholder="Ex. Alimentação"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            autoFocus
                        />

                        <Input
                            label="Descrição"
                            placeholder="Descrição da categoria"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            helperText="Opcional"
                        />

                        <div>
                            <label className="input-label" style={{ marginBottom: '8px', display: 'block' }}>Ícone</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '8px' }}>
                                {AVAILABLE_ICONS.map(iconName => {
                                    const IconComp = iconMap[iconName];
                                    const isSelected = selectedIcon === iconName;
                                    return (
                                        <button
                                            key={iconName}
                                            type="button"
                                            onClick={() => setSelectedIcon(iconName)}
                                            style={{
                                                aspectRatio: '1',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '8px',
                                                border: isSelected ? '1px solid var(--success)' : '1px solid var(--border-color)',
                                                backgroundColor: 'transparent',
                                                color: 'var(--text-secondary)',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                padding: '8px'
                                            }}
                                        >
                                            <IconComp size={20} />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <label className="input-label" style={{ marginBottom: '8px', display: 'block' }}>Cor</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {AVAILABLE_COLORS.map(color => {
                                    const isSelected = selectedColor === color;

                                    // Map string colors to hex for rendering the picker
                                    const colorHexMap: Record<string, string> = {
                                        'green': 'var(--success)',
                                        'blue': '#3b82f6',
                                        'purple': '#8b5cf6',
                                        'pink': '#ec4899',
                                        'red': 'var(--error)',
                                        'orange': '#f97316',
                                        'yellow': '#eab308'
                                    };

                                    return (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setSelectedColor(color)}
                                            style={{
                                                width: '40px',
                                                height: '24px',
                                                borderRadius: '4px',
                                                border: isSelected ? '1px solid var(--success)' : '1px solid transparent',
                                                padding: isSelected ? '2px' : '0',
                                                backgroundColor: 'transparent',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                boxShadow: isSelected ? '0 0 0 1px var(--border-color)' : 'none'
                                            }}
                                        >
                                            <div style={{
                                                width: '100%',
                                                height: '100%',
                                                borderRadius: '2px',
                                                backgroundColor: colorHexMap[color]
                                            }} />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '32px' }}>
                        <Button variant="primary" type="submit" style={{ width: '100%', padding: '14px', fontSize: '1rem' }}>
                            Salvar
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
