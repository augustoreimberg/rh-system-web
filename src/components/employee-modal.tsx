"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
    createEmployee,
    updateEmployee,
    type Employee,
    type CreateEmployeeData,
} from "@/actions/employee-actions";
import { getFiliais } from "@/actions/filial-actions";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

// Função para formatar valor como moeda brasileira
const formatCurrency = (value: string): string => {
    // Remove tudo que não é dígito
    const numericValue = value.replace(/\D/g, "");

    if (!numericValue) return "";

    // Converte para número e divide por 100 para ter os centavos
    const number = Number.parseInt(numericValue) / 100;

    // Formata como moeda brasileira
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(number);
};

// Função para extrair apenas o valor numérico
const extractNumericValue = (formattedValue: string): string => {
    const numericValue = formattedValue.replace(/\D/g, "");
    if (!numericValue) return "";
    return (Number.parseInt(numericValue) / 100).toString();
};

function parseDecimalString(value: string): number {
    if (!value) return 0;
    return Number.parseFloat(value.replace(",", ".")) || 0;
}

function formatCurrencyInput(value: string): string {
    // Remove tudo que não é dígito
    const numeric = value.replace(/\D/g, "");
    if (!numeric) return "";
    const number = (parseInt(numeric, 10) / 100).toFixed(2);
    return number.replace(".", ",");
}

const formSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    responsibility: z.string().min(1, "Cargo é obrigatório"),
    scale: z.string().min(1, "Escala é obrigatória"),
    shift: z.string().min(1, "Turno é obrigatório"),
    filial: z.string().min(1, "Filial é obrigatória"),
    startDate: z.string().min(1, "Data de início é obrigatória"),
    endDate: z.string().optional(),
    salary: z.string().min(1, "Salário é obrigatório"),
    VC: z.string().optional(),
    VT: z.string().optional(),
    VR: z.string().optional(),
    VA: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface Filial {
    id: number;
    name: string;
}

interface EmployeeModalProps {
    open: boolean;
    onClose: () => void;
    employee?: Employee | null;
}

export function EmployeeModal({ open, onClose, employee }: EmployeeModalProps) {
    const [loading, setLoading] = useState(false);
    const [filiais, setFiliais] = useState<Filial[]>([]);
    const isEditing = !!employee;

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            responsibility: "",
            scale: "",
            shift: "",
            filial: "",
            startDate: "",
            endDate: "",
            salary: "",
            VC: "",
            VT: "",
            VR: "",
            VA: "",
        },
    });

    const fetchFiliais = async () => {
        try {
            const result = await getFiliais();
            if (result.success && result.data) {
                setFiliais(result.data);
            }
        } catch (error) {
            console.error("Erro ao buscar filiais:", error);
        }
    };

    useEffect(() => {
        if (open) {
            fetchFiliais();
        }
    }, [open]);

    useEffect(() => {
        if (employee) {
            form.reset({
                name: employee.name,
                responsibility: employee.responsibility || "",
                scale: employee.scale || "",
                shift: employee.shift || "",
                filial: employee.filial?.id.toString() || "",
                startDate: employee.startDate
                    ? employee.startDate.split("T")[0]
                    : "",
                endDate: employee.endDate ? employee.endDate.split("T")[0] : "",
                salary: employee.salary?.toString() || "",
                VC: employee.VC?.toString() || "",
                VT: employee.VT?.toString() || "",
                VR: employee.VR?.toString() || "",
                VA: employee.VA?.toString() || "",
            });
        } else {
            form.reset({
                name: "",
                responsibility: "",
                scale: "",
                shift: "",
                filial: "",
                startDate: "",
                endDate: "",
                salary: "",
                VC: "",
                VT: "",
                VR: "",
                VA: "",
            });
        }
    }, [employee, form]);

    const onSubmit = async (data: FormData) => {
        try {
            setLoading(true);

            const employeeData: CreateEmployeeData = {
                name: data.name,
                responsibility: data.responsibility,
                scale: data.scale,
                shift: data.shift,
                filial: Number.parseInt(data.filial),
                startDate: new Date(data.startDate).toISOString(),
                endDate: data.endDate
                    ? new Date(data.endDate).toISOString()
                    : new Date().toISOString(),
                salary: Number.parseFloat(data.salary) || 0,
                VC: parseDecimalString(formatCurrencyInput(data.VC ?? "")),
                VT: parseDecimalString(formatCurrencyInput(data.VT ?? "")),
                VR: parseDecimalString(formatCurrencyInput(data.VR ?? "")),
                VA: parseDecimalString(formatCurrencyInput(data.VA ?? "")),
            };

            let result;
            if (isEditing) {
                result = await updateEmployee(
                    employee.documentId,
                    employeeData
                );
            } else {
                result = await createEmployee(employeeData);
            }

            if (result.success) {
                toast.success(
                    `Funcionário ${
                        isEditing ? "atualizado" : "criado"
                    } com sucesso`
                );
                onClose();
            } else {
                toast.error(
                    result.error ||
                        `Erro ao ${
                            isEditing ? "atualizar" : "criar"
                        } funcionário`
                );
            }
        } catch (error) {
            console.error("Erro:", error);
            toast.error(
                `Erro ao ${isEditing ? "atualizar" : "criar"} funcionário`
            );
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        form.reset();
        onClose();
    };

    return (
        <TooltipProvider>
            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {isEditing
                                ? "Editar Funcionário"
                                : "Novo Funcionário"}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditing
                                ? "Edite as informações do funcionário abaixo."
                                : "Preencha as informações para criar um novo funcionário."}
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center gap-1">
                                                <FormLabel>Nome</FormLabel>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>
                                                            Nome completo do
                                                            funcionário
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                            <FormControl>
                                                <Input
                                                    placeholder="Nome do funcionário"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="responsibility"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center gap-1">
                                                <FormLabel>Cargo</FormLabel>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>
                                                            Função ou cargo
                                                            exercido pelo
                                                            funcionário
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                            <FormControl>
                                                <Input
                                                    placeholder="Cargo do funcionário"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="filial"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center gap-1">
                                                <FormLabel>Filial</FormLabel>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>
                                                            Unidade/filial onde
                                                            o funcionário
                                                            trabalha
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full min-w-[200px] max-w-[300px]">
                                                        <SelectValue
                                                            placeholder="Selecione uma filial"
                                                            className="truncate"
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {filiais.map((filial) => (
                                                        <SelectItem
                                                            key={filial.id}
                                                            value={filial.id.toString()}
                                                            className="truncate max-w-[300px]"
                                                        >
                                                            {filial.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="scale"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center gap-1">
                                                <FormLabel>Escala</FormLabel>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>
                                                            Escala de trabalho
                                                            (ex: 6x1, 5x2, etc.)
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                            <FormControl>
                                                <Input
                                                    placeholder="Escala de trabalho"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="shift"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center gap-1">
                                                <FormLabel>Turno</FormLabel>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>
                                                            Turno de trabalho
                                                            (manhã, tarde,
                                                            noite)
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                            <FormControl>
                                                <Input
                                                    placeholder="Turno de trabalho"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="salary"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center gap-1">
                                                <FormLabel>Salário</FormLabel>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>
                                                            Salário base mensal
                                                            do funcionário
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="R$ 0,00"
                                                    value={formatCurrency(
                                                        field.value
                                                    )}
                                                    onChange={(e) => {
                                                        const inputValue =
                                                            e.target.value;
                                                        if (
                                                            inputValue === "" ||
                                                            inputValue ===
                                                                "R$ " ||
                                                            inputValue === "R$"
                                                        ) {
                                                            field.onChange("");
                                                            return;
                                                        }
                                                        const numericValue =
                                                            extractNumericValue(
                                                                inputValue
                                                            );
                                                        field.onChange(
                                                            numericValue
                                                        );
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="startDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center gap-1">
                                                <FormLabel>
                                                    Data de Início
                                                </FormLabel>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>
                                                            Data de início do
                                                            funcionário na
                                                            empresa
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="endDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center gap-1">
                                                <FormLabel>
                                                    Data de Fim (Opcional)
                                                </FormLabel>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>
                                                            Data de desligamento
                                                            (deixe vazio se
                                                            ainda ativo)
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="VC"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center gap-1">
                                                <FormLabel>
                                                    Vale Combustível
                                                </FormLabel>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>
                                                            Valor mensal do vale
                                                            combustível
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="R$ 0,00"
                                                    value={`R$ ${formatCurrencyInput(
                                                        field.value ?? ""
                                                    )}`}
                                                    onChange={(e) => {
                                                        const raw =
                                                            e.target.value.replace(
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

                                <FormField
                                    control={form.control}
                                    name="VT"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center gap-1">
                                                <FormLabel>
                                                    Vale Transporte
                                                </FormLabel>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>
                                                            Valor mensal do vale
                                                            transporte
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="R$ 0,00"
                                                    value={`R$ ${formatCurrencyInput(
                                                        field.value ?? ""
                                                    )}`}
                                                    onChange={(e) => {
                                                        const raw =
                                                            e.target.value.replace(
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

                                <FormField
                                    control={form.control}
                                    name="VR"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center gap-1">
                                                <FormLabel>
                                                    Vale Refeição
                                                </FormLabel>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>
                                                            Valor mensal do vale
                                                            refeição
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="R$ 0,00"
                                                    value={`R$ ${formatCurrencyInput(
                                                        field.value ?? ""
                                                    )}`}
                                                    onChange={(e) => {
                                                        const raw =
                                                            e.target.value.replace(
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

                                <FormField
                                    control={form.control}
                                    name="VA"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center gap-1">
                                                <FormLabel>
                                                    Vale Alimentação
                                                </FormLabel>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>
                                                            Valor mensal do vale
                                                            alimentação
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="R$ 0,00"
                                                    value={`R$ ${formatCurrencyInput(
                                                        field.value ?? ""
                                                    )}`}
                                                    onChange={(e) => {
                                                        const raw =
                                                            e.target.value.replace(
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

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleClose}
                                    disabled={loading}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    {loading
                                        ? "Salvando..."
                                        : isEditing
                                        ? "Atualizar"
                                        : "Criar"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </TooltipProvider>
    );
}
