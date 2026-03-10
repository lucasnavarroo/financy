import { useQuery } from '@apollo/client/react';
import { Link } from 'react-router-dom';
import {
    Wallet, ArrowDownCircle, ArrowUpCircle,
    Briefcase, Utensils, Car, ShoppingCart, TrendingUp, Tag as TagIcon, Zap, Film,
    ChevronRight, ArrowRightCircle, Plus
} from 'lucide-react';
import { GET_TRANSACTIONS } from '../graphql/queries';
import { Tag } from '../components/ui';
import type { TagColor } from '../components/ui';

const getCategoryStyle = (categoryName: string): { color: TagColor, icon: any } => {
    const name = categoryName.toLowerCase();
    if (name.includes('alimentação') || name.includes('restaurante')) return { color: 'blue', icon: Utensils };
    if (name.includes('transporte') || name.includes('carro') || name.includes('gasolina')) return { color: 'purple', icon: Car };
    if (name.includes('mercado') || name.includes('compras')) return { color: 'orange', icon: ShoppingCart };
    if (name.includes('entretenimento')) return { color: 'pink', icon: Film };
    if (name.includes('salário')) return { color: 'green', icon: Briefcase };
    if (name.includes('utilidades') || name.includes('contas')) return { color: 'yellow', icon: Zap };
    if (name.includes('salário') || name.includes('receita') || name.includes('investimento')) return { color: 'green', icon: TrendingUp };
    return { color: 'gray', icon: TagIcon };
};

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export default function Dashboard() {
    const { data: txData, loading: txLoading, error: txError } = useQuery(GET_TRANSACTIONS);

    if (txLoading) return <div className="container" style={{ paddingTop: '40px' }}>Carregando seu dashboard...</div>;
    if (txError) return <div className="container" style={{ padding: '40px', color: 'var(--error)' }}>Erro ao carregar dashboard: {txError.message}</div>;

    const transactions = (txData as any)?.transactions || [];

    const totalIncome = transactions
        .filter((tx: any) => tx.type === 'INCOME')
        .reduce((acc: number, tx: any) => acc + tx.amount, 0);

    const totalExpense = transactions
        .filter((tx: any) => tx.type === 'EXPENSE')
        .reduce((acc: number, tx: any) => acc + tx.amount, 0);

    const balance = totalIncome - totalExpense;

    const recentTransactions = [...transactions]
        .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
        .slice(0, 5);

    // Grouping transactions by category for the categories summary
    const categorySummary = transactions.reduce((acc: any, tx: any) => {
        const catName = tx.category.name;
        if (!acc[catName]) {
            acc[catName] = { count: 0, total: 0, name: catName };
        }
        acc[catName].count += 1;
        // If we want to sum only expenses, or absolute amounts. We'll absolute amount here.
        acc[catName].total += tx.amount;
        return acc;
    }, {});

    const sortedCategories = Object.values(categorySummary)
        .sort((a: any, b: any) => b.total - a.total).slice(0, 6);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Top Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                <div className="card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.875rem', fontWeight: 600 }}>
                        <Wallet size={18} color="#8b5cf6" />
                        SALDO TOTAL
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>
                        {formatCurrency(balance)}
                    </h2>
                </div>

                <div className="card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.875rem', fontWeight: 600 }}>
                        <ArrowUpCircle size={18} color="var(--success)" />
                        RECEITAS DO MÊS
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>
                        {formatCurrency(totalIncome)}
                    </h2>
                </div>

                <div className="card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.875rem', fontWeight: 600 }}>
                        <ArrowDownCircle size={18} color="var(--error)" />
                        DESPESAS DO MÊS
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>
                        {formatCurrency(totalExpense)}
                    </h2>
                </div>
            </div>

            {/* Main Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>

                {/* Recent Transactions */}
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', margin: 0 }}>TRANSAÇÕES RECENTES</h3>
                        <Link to="/transactions" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            Ver todas <ChevronRight size={16} />
                        </Link>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {recentTransactions.map((tx: any) => {
                            const style = getCategoryStyle(tx.category.name);
                            const IconComponent = style.icon;
                            return (
                                <div key={tx.id} style={{ display: 'flex', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>

                                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: `var(--bg-surface-hover)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px' }}>
                                        <IconComponent size={20} className={style.color === 'green' ? 'text-green-600' : 'text-gray-600'} style={{ color: style.color === 'green' ? 'var(--success)' : (style.color === 'blue' ? '#3b82f6' : 'var(--text-secondary)') }} />
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{tx.title}</h4>
                                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                            {new Date(Number(tx.createdAt)).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                                        </span>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                                        <Tag color={style.color}>{tx.category.name}</Tag>

                                        <span style={{ fontWeight: 600, fontSize: '1rem', color: tx.type === 'INCOME' ? 'var(--success)' : 'var(--text-primary)', width: '120px', textAlign: 'right' }}>
                                            {tx.type === 'INCOME' ? '+ ' : '- '}{formatCurrency(tx.amount)}
                                        </span>

                                        <ArrowRightCircle size={18} color="var(--error)" style={{ color: tx.type === 'INCOME' ? 'var(--success)' : 'var(--error)' }} />
                                    </div>
                                </div>
                            );
                        })}

                        {recentTransactions.length === 0 && (
                            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                Nenhuma transação encontrada.
                            </div>
                        )}

                        <div style={{ padding: '24px', display: 'flex', justifyContent: 'center' }}>
                            <Link to="/transactions" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.875rem' }}>
                                <Plus size={16} /> Nova transação
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Categories Summary */}
                <div className="card" style={{ padding: 0, height: 'fit-content' }}>
                    <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', margin: 0 }}>CATEGORIAS</h3>
                        <Link to="/categories" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            Gerenciar <ChevronRight size={16} />
                        </Link>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', padding: '12px 0' }}>
                        {sortedCategories.map((cat: any) => {
                            const style = getCategoryStyle(cat.name);
                            return (
                                <div key={cat.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px' }}>
                                    <Tag color={style.color} style={{ minWidth: '100px', textAlign: 'center' }}>{cat.name}</Tag>

                                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{cat.count} itens</span>
                                        <span style={{ fontWeight: 600, fontSize: '0.875rem', width: '80px', textAlign: 'right' }}>
                                            {formatCurrency(cat.total)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}

                        {sortedCategories.length === 0 && (
                            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                Nenhuma categoria encontrada.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
