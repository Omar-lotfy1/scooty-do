'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { submitContact } from '@/app/actions/contact'
import { contactSchema, type ContactFormData } from '@/lib/validations/contact'
import { useTranslations } from 'next-intl'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ContactForm() {
  const t = useTranslations('Contact')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    const result = await submitContact(data)

    if (result.success) {
      setSubmitStatus('success')
      reset()
    } else {
      setSubmitStatus('error')
      setErrorMessage(result.error || 'Something went wrong')
    }
    
    setIsSubmitting(false)
  }

  if (submitStatus === 'success') {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl bg-orange-50 p-8 text-center border border-orange-100">
        <CheckCircle2 className="h-16 w-16 text-orange-500 mb-4" />
        <h3 className="text-xl font-bold text-stone-900 mb-2">{t('successTitle')}</h3>
        <p className="text-stone-600">{t('successDesc')}</p>
        <button 
          onClick={() => setSubmitStatus('idle')}
          className="mt-6 font-medium text-orange-600 hover:text-orange-700"
        >
          {t('sendAnother')}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rtl:text-right">
      {submitStatus === 'error' && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
          {errorMessage}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name" className="text-stone-700">{t('name')}</Label>
        <Input 
          id="name" 
          {...register('name')} 
          className={`bg-white ${errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''} rtl:text-right`}
        />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-stone-700">{t('email')}</Label>
        <Input 
          id="email" 
          type="email" 
          {...register('email')} 
          className={`bg-white ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''} rtl:text-right ltr:text-left`}
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-stone-700">{t('phone')}</Label>
        <Input 
          id="phone" 
          type="tel" 
          {...register('phone')} 
          className="bg-white rtl:text-right ltr:text-left"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-stone-700">{t('message')}</Label>
        <textarea
          id="message"
          rows={5}
          {...register('message')}
          className={`flex w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 ${
            errors.message ? 'border-red-500 focus-visible:ring-red-500' : 'border-input focus-visible:ring-ring'
          } rtl:text-right`}
        />
        {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center items-center rounded-xl bg-stone-900 px-8 py-4 font-bold text-white transition-all hover:bg-stone-800 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          t('submit')
        )}
      </button>
    </form>
  )
}
