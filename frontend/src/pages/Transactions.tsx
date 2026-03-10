import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import {
    Plus, Edit2, Trash2, LibraryBig, Search,
    ArrowDownCircle, ArrowUpCircle, Utensils, Car, ShoppingCart, Film, Zap, TrendingUp, Tag as TagIcon
} from 'lucide-react';
import Modal from '../components/Modal';
import { Button, Input, Select, Tag, Pagination } from '../components/ui';
import type { TagColor } from '../components/ui';
import { GET_TRANSACTIONS, GET_CATEGORIES } from '../graphql/queries';
import { CREATE_TRANSACTION, UPDATE_TRANSACTION, DELETE_TRANSACTION } from '../graphql/mutations';

interface Category {
    id: string;
    name: string;
}

interface Transaction {
    id: string;
    title: string;
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    category: Category;
    createdAt: string;
}

interface GetTransactionsData {
    transactions: Transaction[];
}

interface GetCategoriesData {
    categories: Category[];
}

const getCategoryStyle = (categoryName: string): { color: TagColor, icon: any } => {
    const name = categoryName.toLowerCase();
    if (name.includes('alimentação') || name.includes('restaurante')) return { color: 'blue', icon: Utensils };
    if (name.includes('transporte') || name.includes('carro') || name.includes('gasolina')) return { color: 'purple', icon: Car };
    if (name.includes('mercado') || name.includes('compras')) return { color: 'orange', icon: ShoppingCart };
    if (name.includes('entretenimento') || name.includes('cinema')) return { color: 'pink', icon: Film };
    if (name.includes('utilidades') || name.includes('aluguel') || name.includes('contas')) return { color: 'yellow', icon: Zap };
    if (name.includes('salário') || name.includes('freelance') || name.includes('investimento')) return { color: 'green', icon: TrendingUp };
    return { color: 'gray', icon: TagIcon };
};

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export default function Transactions() {
    const { data: txData, loading: txLoading, error: txError, refetch: refetchTx } = useQuery<GetTransactionsData>(GET_TRANSACTIONS);
    const { data: catData } = useQuery<GetCategoriesData>(GET_CATEGORIES);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTx, setEditingTx] = useState<Transaction | null>(null);

    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
    const [categoryId, setCategoryId] = useState('');

    // Filters & Pagination State
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('ALL');
    const [filterCategory, setFilterCategory] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [createTransaction] = useMutation(CREATE_TRANSACTION, {
        onCompleted: () => {
            refetchTx();
            closeModal();
        }
    });

    const [updateTransaction] = useMutation(UPDATE_TRANSACTION, {
        onCompleted: () => {
            refetchTx();
            closeModal();
        }
    });

    const [deleteTransaction] = useMutation(DELETE_TRANSACTION, {
        onCompleted: () => refetchTx()
    });

    const openCreateModal = () => {
        setEditingTx(null);
        setTitle('');
        setAmount('');
        setType('EXPENSE');
        setCategoryId(catData?.categories?.[0]?.id || '');
        setIsModalOpen(true);
    };

    const openEditModal = (tx: Transaction) => {
        setEditingTx(tx);
        setTitle(tx.title);
        setAmount(tx.amount.toString());
        setType(tx.type);
        setCategoryId(tx.category.id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTx(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const parsedAmount = parseFloat(amount);
        if (!parsedAmount || !categoryId) return;

        if (editingTx) {
            await updateTransaction({
                variables: { id: editingTx.id, title, amount: parsedAmount, type, categoryId }
            });
        } else {
            await createTransaction({
                variables: { title, amount: parsedAmount, type, categoryId }
            });
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
            await deleteTransaction({ variables: { id } });
        }
    };

    if (txLoading) return <div className="container" style={{ paddingTop: '40px' }}>Carregando transações...</div>;
    if (txError) return <div className="container" style={{ padding: '40px', color: 'var(--error)' }}>Erro ao carregar transações: {txError.message}</div>;

    const allTransactions: Transaction[] = txData?.transactions || [];
    const allCategories: Category[] = catData?.categories || [];

    // Apply Filters
    const filteredTransactions = allTransactions.filter(tx => {
        const matchesSearch = tx.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'ALL' || tx.type === filterType;
        const matchesCategory = filterCategory === 'ALL' || tx.category.id === filterCategory;
        return matchesSearch && matchesType && matchesCategory;
    }).sort((a, b) => Number(b.createdAt) - Number(a.createdAt));

    // Pagination logic
    const totalItems = filteredTransactions.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Reset page to 1 if filters change and current page is now invalid
    if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(1);
    }

    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div style={{ paddingBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>Transações</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Gerencie todas as suas transações financeiras</p>
                </div>
                <Button variant="primary" onClick={openCreateModal} icon={<Plus size={18} />}>
                    Nova transação
                </Button>
            </div>

            <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                    <Input
                        label="Buscar"
                        placeholder="Buscar por descrição"
                        leftIcon={<Search size={18} />}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Select
                        label="Tipo"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="ALL">Todos</option>
                        <option value="INCOME">Receita</option>
                        <option value="EXPENSE">Despesa</option>
                    </Select>
                    <Select
                        label="Categoria"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <option value="ALL">Todas</option>
                        {allCategories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </Select>
                    <Select
                        label="Período"
                    >
                        {/* Static for mockup purposes. Normally would map unique months/years from data */}
                        <option value="ALL">Novembro / 2025</option>
                        <option value="OUT">Outubro / 2025</option>
                    </Select>
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {paginatedTransactions.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
                        <LibraryBig size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                        <p>Nenhuma transação encontrada.</p>
                    </div>
                ) : (
                    <div>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th style={{ paddingLeft: '24px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Descrição</th>
                                    <th style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Data</th>
                                    <th style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Categoria</th>
                                    <th style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tipo</th>
                                    <th style={{ textAlign: 'right', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Valor</th>
                                    <th style={{ textAlign: 'right', paddingRight: '24px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedTransactions.map((tx) => {
                                    const style = getCategoryStyle(tx.category.name);
                                    const IconComponent = style.icon;

                                    return (
                                        <tr key={tx.id}>
                                            <td style={{ paddingLeft: '24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--bg-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <IconComponent size={18} style={{ color: style.color === 'green' ? 'var(--success)' : (style.color === 'blue' ? '#3b82f6' : 'var(--text-secondary)') }} />
                                                    </div>
                                                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{tx.title}</span>
                                                </div>
                                            </td>
                                            <td style={{ color: 'var(--text-secondary)' }}>
                                                {new Date(Number(tx.createdAt)).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                                            </td>
                                            <td>
                                                <Tag color={style.color}>{tx.category.name}</Tag>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: tx.type === 'INCOME' ? 'var(--success)' : 'var(--error)', fontSize: '0.875rem', fontWeight: 500 }}>
                                                    {tx.type === 'INCOME' ? <ArrowUpCircle size={16} /> : <ArrowDownCircle size={16} />}
                                                    {tx.type === 'INCOME' ? 'Receita' : 'Despesa'}
                                                </div>
                                            </td>
                                            <td style={{
                                                textAlign: 'right',
                                                fontWeight: 600,
                                                color: 'var(--text-primary)'
                                            }}>
                                                {tx.type === 'INCOME' ? '+ ' : '- '}{formatCurrency(tx.amount)}
                                            </td>
                                            <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                                                <button className="btn btn-secondary" style={{ padding: '6px', marginRight: '8px', border: '1px solid var(--border-color)', borderRadius: '6px' }} onClick={() => openEditModal(tx)} aria-label="Editar">
                                                    <Edit2 size={16} color="var(--text-secondary)" />
                                                </button>
                                                <button className="btn btn-secondary" style={{ padding: '6px', border: '1px solid var(--border-color)', borderRadius: '6px' }} onClick={() => handleDelete(tx.id)} aria-label="Excluir">
                                                    <Trash2 size={16} color="var(--error)" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)' }}>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                {totalItems > 0 ? `${startIndex} a ${endIndex} | ${totalItems} resultados` : '0 resultados'}
                            </div>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                                className="!mt-0"
                            />
                        </div>
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={editingTx ? 'Editar Transação' : 'Nova Transação'}
            >
                <form onSubmit={handleSubmit}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '-12px', marginBottom: '24px' }}>
                        Registre sua despesa ou receita
                    </p>

                    <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                        <button
                            type="button"
                            onClick={() => setType('EXPENSE')}
                            style={{
                                flex: 1, padding: '12px', borderRadius: '8px',
                                border: type === 'EXPENSE' ? '1px solid var(--error)' : '1px solid var(--border-color)',
                                backgroundColor: 'transparent',
                                color: type === 'EXPENSE' ? 'var(--text-primary)' : 'var(--text-secondary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                cursor: 'pointer', transition: 'all 0.2s', fontWeight: 500, fontSize: '0.9rem'
                            }}
                        >
                            <ArrowDownCircle size={18} color={type === 'EXPENSE' ? 'var(--error)' : 'var(--text-muted)'} />
                            Despesa
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('INCOME')}
                            style={{
                                flex: 1, padding: '12px', borderRadius: '8px',
                                border: type === 'INCOME' ? '1px solid var(--success)' : '1px solid var(--border-color)',
                                backgroundColor: 'transparent',
                                color: type === 'INCOME' ? 'var(--text-primary)' : 'var(--text-secondary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                cursor: 'pointer', transition: 'all 0.2s', fontWeight: 500, fontSize: '0.9rem'
                            }}
                        >
                            <ArrowUpCircle size={18} color={type === 'INCOME' ? 'var(--success)' : 'var(--text-muted)'} />
                            Receita
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <Input
                            label="Descrição"
                            placeholder="Ex. Almoço no restaurante"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <Input
                                label="Data"
                                type="date"
                                value={new Date().toISOString().split('T')[0]} // Hardcoded visual for mockup
                                onChange={() => { }}
                            />

                            <Input
                                label="Valor"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0,00"
                                leftIcon={<span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>R$</span>}
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </div>

                        <Select
                            label="Categoria"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            required
                            helperText={allCategories.length === 0 ? "Você precisa criar uma categoria primeiro." : undefined}
                        >
                            <option value="" disabled>Selecione</option>
                            {allCategories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </Select>
                    </div>

                    <div style={{ marginTop: '32px' }}>
                        <Button variant="primary" type="submit" disabled={allCategories.length === 0} style={{ width: '100%', padding: '14px', fontSize: '1rem' }}>
                            Salvar
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
