import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertLeadSchema, type LeadFormData } from '@shared/schema';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

// Client-side form schema - omit sessionId since it's managed by ChatContext
const leadFormSchema = insertLeadSchema.omit({ sessionId: true });
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DynamicFormMessageProps {
  onSubmit: (data: LeadFormData) => void;
  message: string;
}

export default function DynamicFormMessage({ onSubmit, message }: DynamicFormMessageProps) {
  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      consultationFor: 'myself',
      primaryHealthConcern: '',
      triedOtherTreatments: 'no',
    },
  });

  console.log('[FORM] Current form state:', {
    isValid: form.formState.isValid,
    isSubmitting: form.formState.isSubmitting,
    errors: form.formState.errors,
    values: form.getValues(),
  });

  const handleSubmit = (data: LeadFormData) => {
    console.log('[FORM] handleSubmit called! Data:', data);
    console.log('[FORM] Form errors:', form.formState.errors);
    onSubmit(data);
  };
  
  const handleInvalidSubmit = (errors: any) => {
    console.log('[FORM] Form validation FAILED! Errors:', errors);
  };

  return (
    <div className="flex gap-2 sm:gap-3 mr-auto max-w-[95%]" data-testid="form-message">
      <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
        <AvatarFallback className="bg-primary text-primary-foreground text-xs sm:text-sm font-semibold">
          FG
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 px-3 py-3 sm:px-6 sm:py-5 rounded-2xl rounded-tl-sm bg-card text-card-foreground border border-card-border">
        <p className="text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">{message}</p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit, handleInvalidSubmit)} className="space-y-3 sm:space-y-5">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your full name"
                      data-testid="input-full-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Email Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="your.email@example.com"
                      data-testid="input-email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="consultationFor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Who is this consultation for?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-consultation-for">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="myself">Myself</SelectItem>
                      <SelectItem value="my-child">My Child</SelectItem>
                      <SelectItem value="my-spouse">My Spouse</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="primaryHealthConcern"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Primary Health Concern</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe your main health concern or challenge..."
                      className="min-h-[120px] resize-vertical"
                      data-testid="textarea-health-concern"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="triedOtherTreatments"
              render={({ field}) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Have you tried other treatments?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-tried-treatments">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full md:w-auto md:ml-auto md:flex"
              disabled={form.formState.isSubmitting}
              data-testid="button-submit-form"
            >
              {form.formState.isSubmitting ? 'Submitting...' : 'Submit Information'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
