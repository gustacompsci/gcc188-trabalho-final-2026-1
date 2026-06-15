import { Button } from "@extraufla/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@extraufla/ui/components/card";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

const categories = [
  {
    title: "Empresas Juniores",
    description: "Desenvolva habilidades práticas em projetos reais dentro da universidade.",
  },
  {
    title: "Projetos de Extensão",
    description: "Conecte o conhecimento acadêmico com impacto real na comunidade.",
  },
  {
    title: "Núcleos de Estudo",
    description: "Aprofunde-se em tecnologia, ciência e inovação com colegas.",
  },
];

function HomeComponent() {
  return (
    <main className="min-h-full bg-background">
      <section className="container mx-auto max-w-4xl px-4 py-28 text-center">
        <span className="mb-4 inline-block rounded-full border bg-muted px-3 py-1 text-muted-foreground text-xs">
          Plataforma de atividades extracurriculares · UFLA
        </span>
        <h1 className="font-bold font-heading text-5xl text-foreground tracking-tight sm:text-6xl">
          Tudo que acontece fora da sala, em um só lugar.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          Empresas juniores, projetos de extensão e núcleos de estudo da UFLA — centralizados para
          você encontrar, participar e crescer.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link to="/organizations">
            <Button size="lg">Explorar atividades</Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="outline">
              Entrar
            </Button>
          </Link>
        </div>
      </section>

      <section className="container mx-auto max-w-4xl px-4 pb-24">
        <div className="grid gap-6 sm:grid-cols-3">
          {categories.map((cat) => (
            <Card key={cat.title} className="transition-colors hover:border-primary/50">
              <CardHeader>
                <CardTitle className="font-heading">{cat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{cat.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
