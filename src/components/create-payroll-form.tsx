"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createPayroll } from "@/actions/payroll-actions";
import {
    getEmployeesPayroll,
    Employee as FullEmployee,
} from "@/actions/get-employees-payroll";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Usa o tipo Employee completo para garantir compatibilidade
type Employee = FullEmployee;

interface CreatePayrollFormProps {
    employee: Employee;
    onSuccess: (updatedEmployee?: Employee) => void;
    month: number;
    year: number;
}

const formSchema = z.object({
    quantityVR: z.coerce.number().min(0, "Deve ser maior ou igual a 0"),
    quantityVT: z.coerce.number().min(0, "Deve ser maior ou igual a 0"),
    quantityVC: z.coerce.number().min(0, "Deve ser maior ou igual a 0"),
    quantityDayWork: z.coerce
        .number()
        .min(0, "Deve ser maior ou igual a 0")
        .max(31, "Máximo de 31 dias"),
    gratification: z.string().min(0, "Deve ser maior ou igual a 0"),
    discount: z.string().min(0, "Deve ser maior ou igual a 0"),
    paymentDate: z.date().nullable(),
});

function formatCurrencyInput(value: string): string {
    const numeric = value.replace(/\D/g, "");
    if (!numeric) return "";
    const number = (parseInt(numeric, 10) / 100).toFixed(2);
    return number.replace(".", ",");
}

function parseDecimalString(value: string): number {
    if (!value) return 0;
    // Se o valor já é um número (sem formatação), retorna diretamente
    if (!isNaN(Number(value))) {
        return Number(value);
    }
    // Se tem formatação de moeda, converte
    return Number.parseFloat(value.replace(",", ".")) || 0;
}

export function CreatePayrollForm({
    employee,
    onSuccess,
    month,
    year,
}: CreatePayrollFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            quantityVR: 0,
            quantityVT: 0,
            quantityVC: 0,
            quantityDayWork: 20,
            gratification: "",
            discount: "",
            paymentDate: null,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        setError(null);

        try {
            const paymentDate = values.paymentDate
                ? format(values.paymentDate, "yyyy-MM-dd")
                : null;

            const createdDate = new Date(year, month - 1, 1);

            await createPayroll({
                employe: employee.documentId,
                quantityVR: values.quantityVR,
                quantityVT: values.quantityVT,
                quantityVC: values.quantityVC,
                quantityDayWork: values.quantityDayWork,
                gratification: parseDecimalString(values.gratification),
                discount: parseDecimalString(values.discount),
                paymentDate,
                createdDate,
            });

            // Buscar o funcionário atualizado
            const allEmployees = await getEmployeesPayroll(month, year);
            const updatedEmployee = allEmployees.find(
                (e) => e.id === employee.id
            );
            onSuccess(updatedEmployee);
        } catch (err) {
            console.error("Erro ao criar folha de pagamento:", err);
            setError(
                "Ocorreu um erro ao criar a folha de pagamento. Tente novamente."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 py-2"
            >
                <div className="mb-4">
                    <p className="font-medium">Funcionário: {employee.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="quantityDayWork"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Dias Trabalhados</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min={0}
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                e.target.value === ""
                                                    ? 0
                                                    : Number(e.target.value)
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="gratification"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Gratificação (R$)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="R$ 0,00"
                                        value={`R$ ${formatCurrencyInput(
                                            field.value?.toString() ?? ""
                                        )}`}
                                        onChange={(e) => {
                                            const raw = e.target.value.replace(
                                                /\D/g,
                                                ""
                                            );
                                            field.onChange(raw);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="quantityVR"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Qtd. VR</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        inputMode="decimal"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="quantityVT"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Qtd. VT</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        inputMode="decimal"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="quantityVC"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Qtd. VC</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        inputMode="decimal"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="discount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Desconto</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="R$ 0,00"
                                        value={`R$ ${formatCurrencyInput(
                                            field.value?.toString() ?? ""
                                        )}`}
                                        onChange={(e) => {
                                            const raw = e.target.value.replace(
                                                /\D/g,
                                                ""
                                            );
                                            field.onChange(raw);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="paymentDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Data de Pagamento</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !field.value &&
                                                    "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP", {
                                                    locale: ptBR,
                                                })
                                            ) : (
                                                <span>Selecione uma data</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                >
                                    <Calendar
                                        mode="single"
                                        selected={field.value || undefined}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                        locale={ptBR}
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {error && (
                    <p className="text-sm font-medium text-destructive">
                        {error}
                    </p>
                )}

                <div className="flex justify-end space-x-2 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => form.reset()}
                        disabled={isSubmitting}
                    >
                        Limpar
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Gerando...
                            </>
                        ) : (
                            "Gerar"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
