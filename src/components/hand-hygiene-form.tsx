"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale"; // Import Portuguese locale
import { CalendarIcon, Send, Loader2, AlertTriangle, CheckCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast"; // Import useToast
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  nome: z.string().optional(), // Nome ou Sigla (opcional based on original HTML lack of required)
  observador: z.enum(["oculto", "scih"], { required_error: "Selecione o tipo de observador." }),
  data: z.date({ required_error: "A data é obrigatória." }),
  profissao: z.enum(["TEC_ENF", "ENF", "MED", "FISIO", "FONO", "NUTRI", "EP"], { required_error: "Selecione a profissão." }),
  turno: z.enum(["MANHÃ", "TARDE", "NOITE"], { required_error: "Selecione o turno." }),
  setor: z.enum(["UTI ADU", "UTI PED", "UTI NEO", "PSA", "PSI", "PSGO", "PSORT", "5°Onco", "5°clinico", "7°", "6°", "mater", "PED", "CC", "CO", "HOSP DIA", "SADT"], { required_error: "Selecione o setor." }),
  indicacoes: z.enum(["Ant_pact", "Ant_Proced", "Ap_fluid", "Ap_pact", "Ap_próximo"], { required_error: "Selecione uma indicação." }),
  acao: z.enum(["Ácool", "Sabonete", "Não", "Luvas"], { required_error: "Selecione uma ação." }),
});

type FormData = z.infer<typeof formSchema>;

const SHEET_MONKEY_URL = "https://api.sheetmonkey.io/form/q32tKC5QrSuJQi7LQUjBpV";

export function HandHygieneForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);


  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      // Set default date to today to avoid empty initial state
      data: new Date(),
    },
  });

  async function onSubmit(data: FormData) {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage(null);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
       if (key === 'data' && value instanceof Date) {
         // Format date as YYYY-MM-DD for SheetMonkey compatibility if needed
         // Adjust format based on SheetMonkey expectation or keep JS Date object
         formData.append(key, format(value, "yyyy-MM-dd"));
       } else if (value !== undefined && value !== null) {
         formData.append(key, String(value));
       }
    });

    // Log FormData content for debugging
    // for (let [key, value] of formData.entries()) {
    //   console.log(`${key}: ${value}`);
    // }

    try {
      const response = await fetch(SHEET_MONKEY_URL, {
        method: "POST",
        body: new URLSearchParams(formData as any), // Send as x-www-form-urlencoded
        headers: {
           // Content-Type is set automatically by fetch for URLSearchParams
        },
      });

      if (response.ok) {
        setSubmitStatus("success");
         toast({
            title: "Sucesso!",
            description: "Registro enviado com sucesso.",
            variant: "default", // Use default (or could be 'success' if styled)
          });
        form.reset({ data: new Date() }); // Reset form after successful submission, keeping today's date
      } else {
        const errorText = await response.text();
        setSubmitStatus("error");
        setErrorMessage(`Erro ${response.status}: ${errorText || 'Falha ao enviar o registro.'}`);
         toast({
           title: "Erro",
           description: `Falha ao enviar o registro. ${errorText || ''}`,
           variant: "destructive",
         });
      }
    } catch (error) {
       setSubmitStatus("error");
       const message = error instanceof Error ? error.message : "Erro de rede ou desconhecido.";
       setErrorMessage(`Erro ao conectar: ${message}`);
       toast({
         title: "Erro de Conexão",
         description: `Não foi possível enviar o registro. Verifique sua conexão. ${message}`,
         variant: "destructive",
       });
       console.error("Fetch error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {submitStatus === 'success' && (
        <Alert variant="default" className="mb-4 bg-green-100 border-green-400 text-green-700">
           <CheckCircle className="h-4 w-4 text-green-700" />
          <AlertTitle>Sucesso!</AlertTitle>
          <AlertDescription>Seu registro foi enviado com sucesso.</AlertDescription>
        </Alert>
      )}
      {submitStatus === 'error' && (
         <Alert variant="destructive" className="mb-4">
           <AlertTriangle className="h-4 w-4" />
           <AlertTitle>Erro no Envio</AlertTitle>
           <AlertDescription>{errorMessage || "Ocorreu um erro ao enviar o registro."}</AlertDescription>
         </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome ou Sigla (Observador)</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome ou sigla" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observador"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observador</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="oculto">Oculto</SelectItem>
                      <SelectItem value="scih">SCIH</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <FormField
                control={form.control}
                name="data"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR }) // Format date in Portuguese
                            ) : (
                              <span>Escolha uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          locale={ptBR} // Set calendar locale
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

               <FormField
                control={form.control}
                name="profissao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profissão</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a profissão" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="TEC_ENF">Técnico de Enfermagem</SelectItem>
                        <SelectItem value="ENF">Enfermeiro</SelectItem>
                        <SelectItem value="MED">Médico</SelectItem>
                        <SelectItem value="FISIO">Fisioterapeuta</SelectItem>
                        <SelectItem value="FONO">Fonoaudiologia</SelectItem>
                        <SelectItem value="NUTRI">Nutricionista</SelectItem>
                        <SelectItem value="EP">Experiência do Paciente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
           </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <FormField
                control={form.control}
                name="turno"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Turno</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o turno" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MANHÃ">Manhã</SelectItem>
                        <SelectItem value="TARDE">Tarde</SelectItem>
                        <SelectItem value="NOITE">Noite</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

             <FormField
              control={form.control}
              name="setor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Setor</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o setor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="UTI ADU">UTI ADU</SelectItem>
                      <SelectItem value="UTI PED">UTI PED</SelectItem>
                      <SelectItem value="UTI NEO">UTI NEO</SelectItem>
                      <SelectItem value="PSA">PSA</SelectItem>
                      <SelectItem value="PSI">PSI</SelectItem>
                      <SelectItem value="PSGO">PSGO</SelectItem>
                      <SelectItem value="PSORT">PSORT</SelectItem>
                      <SelectItem value="5°Onco">5°Onco</SelectItem>
                      <SelectItem value="5°clinico">5°clinico</SelectItem>
                      <SelectItem value="7°">7°</SelectItem>
                      <SelectItem value="6°">6°</SelectItem>
                      <SelectItem value="mater">Mater</SelectItem>
                      <SelectItem value="PED">PED</SelectItem>
                      <SelectItem value="CC">CC</SelectItem>
                      <SelectItem value="CO">CO</SelectItem>
                      <SelectItem value="HOSP DIA">HOSP DIA</SelectItem>
                      <SelectItem value="SADT">SADT</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="indicacoes"
            render={({ field }) => (
              <FormItem className="space-y-3 border p-4 rounded-md shadow-sm">
                <FormLabel className="text-lg font-semibold text-accent">Indicações</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-2"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Ant_pact" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Antes do contato com paciente
                      </FormLabel>
                    </FormItem>
                     <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Ant_Proced" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Antes de procedimento
                      </FormLabel>
                    </FormItem>
                     <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Ap_fluid" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Após risco de exposição a fluidos
                      </FormLabel>
                    </FormItem>
                     <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Ap_pact" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Após contato com paciente
                      </FormLabel>
                    </FormItem>
                     <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Ap_próximo" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Após contato com proximidades do paciente
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="acao"
            render={({ field }) => (
              <FormItem className="space-y-3 border p-4 rounded-md shadow-sm">
                <FormLabel className="text-lg font-semibold text-accent">Ação</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-2"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Ácool" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Higiene com álcool
                      </FormLabel>
                    </FormItem>
                     <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Sabonete" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Higiene com sabonete
                      </FormLabel>
                    </FormItem>
                     <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Não" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Nenhuma
                      </FormLabel>
                    </FormItem>
                     <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Luvas" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Uso de luvas (sem higiene prévia/posterior observada)
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Registrar
              </>
            )}
          </Button>
        </form>
      </Form>
    </>
  );
}
