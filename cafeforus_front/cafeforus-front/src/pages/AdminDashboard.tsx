import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Category {
    id: number;
    name: string;
    minRLevel: string;
    minWLevel: string;
}

const AdminDashboard = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategory, setNewCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [minReadLevel, setMinReadLevel] = useState('BASIC');
    const [minWriteLevel, setMinWriteLevel] = useState('BASIC');


    // 카테고리 목록 조회
    const fetchCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get('/api/category/all', { withCredentials: true });
            setCategories(res.data);
        } catch (err) {
            setError('카테고리 목록을 가져오는 데 실패했습니다.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // 카테고리 삭제
    const handleDelete = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            await axios.delete(`/api/category/delete/${id}`, { withCredentials: true });
            fetchCategories();  // 카테고리 목록 재조회
        } catch (err) {
            setError('카테고리 삭제에 실패했습니다.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // 카테고리 추가
    const handleAdd = async () => {
        if (!newCategory.trim()) return;

        setLoading(true);
        setError(null);
        try {
            await axios.post('/api/category/add', { name: newCategory, minRLevel: minReadLevel, minWLevel: minWriteLevel }, { withCredentials: true });
            setNewCategory('');
            fetchCategories();  // 카테고리 목록 재조회
        } catch (err) {
            setError('새 카테고리 추가에 실패했습니다.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // 카테고리 수정 함수
    const handleEdit = (category: Category) => {
        setEditingCategory(category); // 수정할 카테고리 설정
        setMinReadLevel(category.minRLevel);
        setMinWriteLevel(category.minWLevel);
    };

    // 수정된 카테고리 저장 함수
    const handleUpdate = async () => {
        if (editingCategory) {
            try {
                await axios.put(`/api/category/update/${editingCategory.id}`, 
                    { name: editingCategory.name,  minRLevel: minReadLevel, minWLevel: minWriteLevel },
                    { withCredentials: true }
                );
                setEditingCategory(null); // 수정 완료 후 입력 필드 초기화
                setMinReadLevel('BASIC');
                setMinWriteLevel('BASIC');
                fetchCategories();  // 카테고리 목록 재조회
            } catch (err) {
                setError('카테고리 수정에 실패했습니다.');
                console.error(err);
            }
        }
    };

    useEffect(() => {
        fetchCategories(); // 컴포넌트 마운트 시 카테고리 목록 조회
    }, []);

    return (
        <div className="p-8 max-w-xl mx-auto mt-32">
            <h1 className="text-2xl font-bold mb-6">📂 카테고리 관리</h1>

            {error && <div className="bg-red-200 text-red-800 p-2 mb-4 rounded">{error}</div>}

            {/* 새 카테고리 추가 */}
            <div className="flex gap-2 mb-4">
                <input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="새 카테고리명"
                    className="border p-2 rounded w-full"
                    disabled={loading}
                />
                

                <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">조회 권한 선택</label>
                    <select
                        value={minReadLevel}
                        onChange={(e) => setMinReadLevel(e.target.value)}
                        className="border p-2 rounded"
                        disabled={loading}
                    >
                        <option value="BASIC">BASIC</option>
                        <option value="SILVER">SILVER</option>
                        <option value="GOLD">GOLD</option>
                        <option value="VIP">VIP</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                </div>

                <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">작성 권한 선택</label>
                    <select
                        value={minWriteLevel}
                        onChange={(e) => setMinWriteLevel(e.target.value)}
                        className="border p-2 rounded"
                        disabled={loading}
                    >
                        <option value="BASIC">BASIC</option>
                        <option value="SILVER">SILVER</option>
                        <option value="GOLD">GOLD</option>
                        <option value="VIP">VIP</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                </div>

                <button
                    onClick={handleAdd}
                    className="bg-green-500 text-white px-4 rounded hover:bg-green-600"
                    disabled={loading}
                >
                    {loading ? '추가 중...' : '추가'}
                </button>
            </div>

            {/* 수정 중인 카테고리 */}
            {editingCategory && (
                <div className="mb-4">
                    <h2 className="text-xl mb-2">카테고리 수정</h2>
                    <input
                        value={editingCategory.name}
                        onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                        className="border p-2 rounded w-full"
                    />
                   <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">조회 권한 선택</label>
                    <select
                        value={minReadLevel}
                        onChange={(e) => setMinReadLevel(e.target.value)}
                        className="border p-2 rounded"
                        disabled={loading}
                    >
                        <option value="BASIC">BASIC</option>
                        <option value="SILVER">SILVER</option>
                        <option value="GOLD">GOLD</option>
                        <option value="VIP">VIP</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                </div>

                <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">작성 권한 선택</label>
                    <select
                        value={minWriteLevel}
                        onChange={(e) => setMinWriteLevel(e.target.value)}
                        className="border p-2 rounded"
                        disabled={loading}
                    >
                        <option value="BASIC">BASIC</option>
                        <option value="SILVER">SILVER</option>
                        <option value="GOLD">GOLD</option>
                        <option value="VIP">VIP</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                </div>
                    <button
                        onClick={handleUpdate}
                        className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600 mt-2"
                        disabled={loading}
                    >
                        {loading ? '수정 중...' : '수정'}
                    </button>
                </div>
            )}

            {loading ? (
                <div>로딩 중...</div>
            ) : (
                <ul className="space-y-2">
                    {categories.map((cat) => (
                        <li key={cat.id} className="flex justify-between items-center border p-2 rounded">
                            <span>{cat.name}</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(cat)}
                                    className="text-blue-500 hover:underline text-sm"
                                    disabled={loading}
                                >
                                    수정
                                </button>
                                <button
                                    onClick={() => handleDelete(cat.id)}
                                    className="text-red-500 hover:underline text-sm"
                                    disabled={loading}
                                >
                                    삭제
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AdminDashboard;
