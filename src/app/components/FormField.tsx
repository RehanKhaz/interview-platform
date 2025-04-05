'use client'

import { FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Controller, useFormContext } from 'react-hook-form'
import type { FieldValues } from 'react-hook-form'


interface FormProps<T extends FieldValues> {
    name: Path<T>,
    label: string,
    placeholder: string,
    type?: 'password' | 'text' | 'email',
}


const FormField = ({ name,  label, placeholder, type }: FormProps<T>) => {
    const {control} = useFormContext()
    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className='label'>{label}</FormLabel>
                    <FormControl>
                        <Input required className='input' type={type} placeholder={placeholder} {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />

    )
}

export default FormField