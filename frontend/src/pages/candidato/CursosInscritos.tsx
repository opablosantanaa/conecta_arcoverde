import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export default function CursosInscritos() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-content dark:text-content-dark mb-1">
          Cursos Inscritos
        </h1>
        <p className="text-content-secondary dark:text-content-secondary">
          Acompanhe os cursos em que você está inscrito.
        </p>
      </div>

      <Card padding="lg">
        <EmptyState
          icon={<BookOpen className="w-8 h-8" />}
          title="Nenhum curso inscrito ainda"
          description="Explore os cursos disponíveis e comece a se capacitar."
          action={
            <Button asChild>
              <Link to="/cursos">Ver cursos disponíveis</Link>
            </Button>
          }
        />
      </Card>
    </div>
  );
}