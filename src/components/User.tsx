'use client'

import { useState, useEffect } from 'react'
import { getCurrentUser } from '@/actions/user'
import { EditUserModal } from './EditUserModal'

export function User() {
  const [user, setUser] = useState<{ username: string; email: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await getCurrentUser()
        console.log("USUARIO ->", userData)
        setUser(userData)
      } catch (error) {
        console.error('Erro ao carregar usuário:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  if (isLoading) {
    return <div>Carregando...</div>
  }

  if (!user) {
    return <div>Erro ao carregar dados do usuário</div>
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{user.username}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Editar Usuário
        </button>
      </div>

      <EditUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
        onSuccess={() => {
          getCurrentUser().then(setUser)
        }}
      />
    </div>
  )
} 