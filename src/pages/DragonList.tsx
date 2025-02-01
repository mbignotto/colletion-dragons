import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { dragonService } from "../services/dragonService";
import CreateDragon from "./CreateDragon";

interface Dragon {
  id: string;
  name: string;
  type: string;
  createdAt: string;
}

const DragonList = () => {
  const { data: dragons, isLoading } = useQuery({
    queryKey: ["dragons"],
    queryFn: dragonService.getAllDragons,
  });

  const { logout } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDragon, setSelectedDragon] = useState<Dragon | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: dragonService.deleteDragon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dragons"] });
      toast({
        title: "Sucesso",
        description: "O dragão foi excluído com sucesso!",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-glow text-dragon">Carregando dragões...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-dragon-light/10 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-serif text-dragon-dark">
            Coleção de Dragões
          </h1>
          <div className="space-x-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-dragon hover:bg-dragon-dark">
                  Adicionar Dragão
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Criar Novo Dragão</DialogTitle>
                </DialogHeader>
                <CreateDragon />
              </DialogContent>
            </Dialog>
            <button
              onClick={logout}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-dragon bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dragon transition-colors duration-200"
            >
              Sair
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dragons?.map((dragon) => (
            <div key={dragon.id} className="relative group">
              <Link to={`/dragons/${dragon.id}`} className="block">
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <h2 className="text-xl font-serif text-dragon-dark group-hover:text-dragon transition-colors duration-200">
                    {dragon.name}
                  </h2>
                  <p className="text-gray-600 mt-2">{dragon.type}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(dragon.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Dialog
                  open={isEditDialogOpen && selectedDragon?.id === dragon.id}
                  onOpenChange={(open) => {
                    setIsEditDialogOpen(open);
                    if (!open) setSelectedDragon(null);
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-white/90 hover:bg-white"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedDragon(dragon);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4 text-dragon" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar Dragão</DialogTitle>
                    </DialogHeader>
                    <CreateDragon
                      dragon={selectedDragon}
                      onSuccess={() => setIsEditDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-white/90 hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation(); // Apenas isso aqui
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir Dragão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir o dragão {dragon.name}?
                        Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e) => {
                          e.preventDefault();
                          deleteMutation.mutate(dragon.id);
                        }}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DragonList;
