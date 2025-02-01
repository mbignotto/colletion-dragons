import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dragonService } from '../services/dragonService';
import { useToast } from '@/components/ui/use-toast';
import { DialogClose } from '@/components/ui/dialog';

interface Dragon {
  id: string;
  name: string;
  type: string;
  createdAt: string;
}

interface CreateDragonProps {
  dragon?: Dragon | null;
  onSuccess?: () => void;
}

const CreateDragon = ({ dragon, onSuccess }: CreateDragonProps) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (dragon) {
      setName(dragon.name);
      setType(dragon.type);
    }
  }, [dragon]);

  const mutation = useMutation({
    mutationFn: (data: { name: string; type: string }) =>
      dragon 
        ? dragonService.updateDragon(dragon.id, data)
        : dragonService.createDragon(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dragons'] });
      toast({
        title: "Sucesso",
        description: dragon ? "Dragão atualizado com sucesso" : "Dragão criado com sucesso",
      });
      setName('');
      setType('');
      if (onSuccess) onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name, type });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          {dragon ? 'Salvar' : 'Criar Dragão'}
        </button>
      </div>
    </form>
  );
};

export default CreateDragon;