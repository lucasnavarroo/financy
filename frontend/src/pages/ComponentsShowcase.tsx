import React from 'react';
import { Button, Input, Select, Tag, Pagination } from '../components/ui';
import { Mail, User } from 'lucide-react';

export default function ComponentsShowcase() {
    return (
        <div className="container" style={{ padding: '40px', backgroundColor: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <h1>UI Components</h1>

            <section>
                <h2>Input</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px', marginTop: '20px' }}>
                    <Input label="Label" placeholder="Placeholder" helperText="Helper" />
                    <Input label="Label" defaultValue="Text " helperText="Helper" leftIcon={<Mail size={18} />} autoFocus />
                    <Input label="Label" defaultValue="Text" helperText="Helper" leftIcon={<Mail size={18} />} />
                    <Input label="Label" defaultValue="Text" helperText="Helper" leftIcon={<Mail size={18} />} error />
                    <Input label="Label" defaultValue="Text" helperText="Helper" leftIcon={<Mail size={18} />} disabled />

                    <Select label="Label">
                        <option>Option 1</option>
                        <option>Option 2</option>
                        <option>Option 3</option>
                    </Select>
                </div>
            </section>

            <section>
                <h2>Label Button</h2>
                <div style={{ display: 'flex', gap: '40px', marginTop: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <Button variant="primary" size="md" icon={<User size={18} />}>Label</Button>
                        <Button variant="primary" size="md" icon={<User size={18} />} className="hover-simulate">Label</Button>
                        <Button variant="primary" size="md" icon={<User size={18} />} disabled>Label</Button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <Button variant="secondary" size="md" icon={<User size={18} />}>Label</Button>
                        <Button variant="secondary" size="md" icon={<User size={18} />} className="hover-simulate">Label</Button>
                        <Button variant="secondary" size="md" icon={<User size={18} />} disabled>Label</Button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <Button variant="primary" size="sm" icon={<User size={16} />}>Label</Button>
                        <Button variant="primary" size="sm" icon={<User size={16} />} className="hover-simulate">Label</Button>
                        <Button variant="primary" size="sm" icon={<User size={16} />} disabled>Label</Button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <Button variant="secondary" size="sm" icon={<User size={16} />}>Label</Button>
                        <Button variant="secondary" size="sm" icon={<User size={16} />} className="hover-simulate">Label</Button>
                        <Button variant="secondary" size="sm" icon={<User size={16} />} disabled>Label</Button>
                    </div>
                </div>
            </section>

            <section>
                <h2>Link</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
                    <a href="#">Label</a>
                    <a href="#" style={{ textDecoration: 'underline' }}>Label</a>
                </div>
            </section>

            <section>
                <h2>Tag</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <Tag color="gray">Label</Tag>
                        <Tag color="blue">Label</Tag>
                        <Tag color="purple">Label</Tag>
                        <Tag color="pink">Label</Tag>
                    </div>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <Tag color="red">Label</Tag>
                        <Tag color="orange">Label</Tag>
                        <Tag color="yellow">Label</Tag>
                        <Tag color="green">Label</Tag>
                    </div>
                </div>
            </section>

            <section>
                <h2>Pagination Button</h2>
                <Pagination currentPage={3} totalPages={6} onPageChange={() => { }} />
            </section>

            <style>{`
                .hover-simulate.btn-primary { box-shadow: var(--shadow-lg), var(--glow-primary); transform: translateY(-2px); }
                .hover-simulate.btn-secondary { background-color: var(--bg-surface-hover); border-color: var(--text-secondary); }
            `}</style>
        </div>
    );
}
