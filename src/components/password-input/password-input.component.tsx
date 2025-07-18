'use client'

import * as React from 'react'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const PasswordInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false)
  // const disabled = props.value === '' || props.value === undefined || props.disabled
  console.log('show', showPassword)
  return (
    <div className="relative" dir={props.dir}>
      <Input
        type={showPassword ? 'text' : 'password'}
        className={cn('hide-password-toggle pr-10', className)}
        ref={ref}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent "
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword && <EyeIcon className="h-4 w-4" aria-hidden="true" />}
        {!showPassword && <EyeOffIcon className="h-4 w-4" aria-hidden="false" />}
      </Button>

      {/* hides browsers password toggles */}
      <style>{`
					.hide-password-toggle::-ms-reveal,
					.hide-password-toggle::-ms-clear {
						visibility: hidden;
						pointer-events: none;
						display: none;
					}
				`}</style>
    </div>
  )
});

PasswordInput.displayName = 'PasswordInput'

export { PasswordInput }