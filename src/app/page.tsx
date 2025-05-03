import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { HandHygieneForm } from '@/components/hand-hygiene-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


export default function Home() {
  return (
    <div className="space-y-8">
      <Header />

       <Alert className="bg-accent/30 border-accent text-accent-foreground">
         <AlertCircle className="h-4 w-4 text-accent-foreground" />
         <AlertTitle className="font-semibold text-accent-foreground">Informativo</AlertTitle>
         <AlertDescription className="text-accent-foreground/90">
           Cada formulário enviado será para 1 oportunidade observada!
         </AlertDescription>
       </Alert>

      <Card className="w-full max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-primary">Preencha os Dados</CardTitle>
           <CardDescription>Registre a observação de higiene das mãos.</CardDescription>
        </CardHeader>
        <CardContent>
          <HandHygieneForm />
        </CardContent>
      </Card>

      <Footer />
    </div>
  );
}
