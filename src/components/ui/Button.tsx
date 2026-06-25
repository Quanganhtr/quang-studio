"use client";

import { Button as BaseButton } from '@base-ui/react/button';
import { motion } from 'framer-motion';
import * as React from 'react';

import { clsx } from 'clsx';
import { trackEvent } from '@/lib/gtag';

export type ButtonVariant = 'solid' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

type BaseButtonProps = React.ComponentPropsWithoutRef<typeof BaseButton>;

export interface ButtonProps extends Omit<BaseButtonProps, 'className'> {
  className?: string;
  loading?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
  href?: string;
  label?: string;
  hoverLabel?: string;
  target?: string;
  rel?: string;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 text-base-bold',
  md: 'h-8 md:h-12 px-3 md:px-5 text-base-bold',
  lg: 'h-14 px-6 text-base-bold',
};
const variantClasses: Record<ButtonVariant, string> = {
  solid:   'border-transparent bg-foreground text-background hover:bg-foreground hover:text-background',
  outline: 'border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground',
  ghost:   'border-transparent bg-transparent text-foreground hover:bg-background hover:text-foreground',
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const Button = React.forwardRef<React.ComponentRef<typeof BaseButton>, ButtonProps>(
  function Button(
    {
      children,
      className,
      disabled,
      focusableWhenDisabled,
      loading = false,
      size = 'md',
      type = 'button',
      variant = 'solid',
      href,
      label,
      hoverLabel,
      target,
      rel,
      onClick,
      ...props
    },
    ref
  ) {
    const [hovered, setHovered] = React.useState(false);

    const sharedClass = clsx(
      'inline-flex cursor-pointer items-center justify-center gap-2 rounded-xs border outline-none transition-colors duration-200 overflow-hidden',
      'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      'disabled:cursor-not-allowed disabled:opacity-60 data-disabled:cursor-not-allowed data-disabled:opacity-60',
      variantClasses[variant],
      sizeClasses[size],
      className
    );

    // Label-swap content — fixed size via invisible spacer
    const labelContent = loading ? (
      <i className="ri-loader-4-line animate-spin text-base" aria-hidden="true" />
    ) : label ? (
      <span className="relative flex flex-col items-center">
        {/* Invisible spacer holding the wider of the two labels */}
        <span className="invisible block whitespace-nowrap px-0" aria-hidden>
          {hoverLabel && hoverLabel.length > label.length ? hoverLabel : label}
        </span>
        {/* Default label */}
        <motion.span
          className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
          animate={{ y: hovered ? '-100%' : '0%', opacity: hovered ? 0 : 1 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          {label}
        </motion.span>
        {/* Hover label */}
        <motion.span
          className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
          animate={{ y: hovered ? '0%' : '100%', opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          {hoverLabel ?? label}
        </motion.span>
      </span>
    ) : (
      <span>{children}</span>
    );

    if (href) {
      return (
        <a
          href={href}
          target={target}
          rel={rel}
          className={sharedClass}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => trackEvent('cta_click', { label: label ?? '', href })}
        >
          {labelContent}
        </a>
      );
    }

    return (
      <BaseButton
        ref={ref}
        className={sharedClass}
        disabled={disabled || loading}
        focusableWhenDisabled={focusableWhenDisabled ?? loading}
        type={type}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={(e) => {
          trackEvent('cta_click', { label: label ?? '' });
          onClick?.(e);
        }}
        {...props}
      >
        {labelContent}
      </BaseButton>
    );
  }
);

export default Button;
