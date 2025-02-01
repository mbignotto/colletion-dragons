import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { dragonService } from '../services/dragonService';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogClose } from '@/components/ui/dialog';

const DragonDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [type, setType] = useState('');

  const { data: dragon, isLoading } = useQuery({
    queryKey: ['dragon', id],
    queryFn: () => dragonService.getDragon(id!),
  });

  useEffect(() => {
    if (dragon) {
      setName(dragon.name);
      setType(dragon.type);
    }
  }, [dragon]);

  const updateMutation = useMutation({
    mutationFn: (data: { name: string; type: string }) =>
      dragonService.updateDragon(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dragon', id] });
      toast({
        title: "Sucesso",
        description: "Dragão atualizado com sucesso",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => dragonService.deleteDragon(id!),
    onSuccess: () => {
      navigate('/dragons');
      toast({
        title: "Sucesso",
        description: "Dragão excluído com sucesso",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-glow text-dragon">Carregando detalhes do dragão...</div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({ name, type });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-dragon-light/10 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-serif text-dragon-dark">Detalhes do Dragão</h1>
            <div className="space-x-4">
              <button
                onClick={() => navigate('/dragons')}
                className="px-4 py-2 text-dragon hover:text-dragon-dark transition-colors duration-200"
              >
                Voltar
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-medium text-gray-500">Nome</h2>
              <p className="mt-1 text-lg text-gray-900">{dragon?.name}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Tipo</h2>
              <p className="mt-1 text-lg text-gray-900">{dragon?.type}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Data de Criação</h2>
              <p className="mt-1 text-lg text-gray-900">
                {new Date(dragon?.createdAt || '').toLocaleDateString()}
              </p>
            </div>
            <div className="flex justify-end space-x-4">
              <Dialog>
                <DialogTrigger className="px-4 py-2 text-dragon hover:text-dragon-dark transition-colors duration-200">
                  Editar
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar Dragão</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nome</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-dragon focus:border-dragon"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tipo</label>
                      <input
                        type="text"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-dragon focus:border-dragon"
                        required
                      />
                    </div>
                    <div className="flex justify-end space-x-4">
                      <DialogClose className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200">
                        Cancelar
                      </DialogClose>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-dragon text-white rounded-md hover:bg-dragon-dark transition-colors duration-200"
                      >
                        Salvar
                      </button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              <button
                onClick={() => {
                  if (window.confirm('Tem certeza que deseja excluir este dragão?')) {
                    deleteMutation.mutate();
                  }
                }}
                className="px-4 py-2 text-red-600 hover:text-red-800 transition-colors duration-200"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DragonDetails;