import { animated, useTransition } from "@react-spring/web"
import React, { ChangeEvent, FocusEvent, forwardRef, ReactNode } from "react"
import styled from "styled-components"
import { error } from "../../../icons/error"
import { FlexContainer } from "../../layout/FlexContainer"
import { Icon } from "../../layout/Icon"
import type { ReactRef } from "../../state/ReactRef"
import { getLengthConstraintColor } from "../getLengthConstraintColor"
import { Input } from "../layout/Input"
import { InputConstraint } from "../layout/InputConstraint"
import { InputContainer } from "../layout/InputContainer"
import { InputLabel } from "../layout/InputLabel"
import { InputValidationError } from "../layout/InputValidationError"

const TextInput = styled(Input)`
  ${FlexContainer} > & {
    flex: 1;
  }
`

type InputChangeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
type InputFocusEvent = FocusEvent<HTMLInputElement | HTMLTextAreaElement>

export type InputFieldProps = {
  id: string
  value: string
  onChange: (value: string) => void
  label: string
  type?: string
  rows?: number
  placeholder?: string
  maxLength?: number
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  error?: string
  className?: string
  onClick?: () => void
  onFocus?: (event: InputFocusEvent) => void
  onBlur?: (event: InputFocusEvent) => void
  children?: ReactNode
}

function InputFieldRenderer(
  props: InputFieldProps,
  ref: ReactRef<HTMLInputElement> | ReactRef<HTMLTextAreaElement>,
) {
  const {
    id,
    value,
    onChange: handleChange,
    label,
    type,
    rows,
    placeholder,
    maxLength,
    required,
    disabled,
    readOnly,
    error: validationError,
    className,
    onClick: handleClick,
    onFocus: handleFocus,
    onBlur: handleBlur,
    children,
  } = props

  const transition = useTransition(validationError, {
    key: validationError,
    config: { tension: 300, clamp: true },
    from: { opacity: (0 as unknown) as undefined, height: 0 },
    enter: { opacity: (1 as unknown) as undefined, height: 24 },
    leave: { opacity: (0 as unknown) as undefined, height: 0 },
  })

  const input = (
    <TextInput
      ref={ref}
      as={rows ? "textarea" : "input"}
      id={id}
      type={type}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      style={{ height: rows ? 15 + 21 * rows : undefined }}
      onChange={(event: InputChangeEvent) => handleChange(event.target.value)}
      onClick={handleClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  )

  return (
    <InputContainer className={className}>
      <InputLabel>
        <label htmlFor={id}>{label}</label>
        {required && <InputConstraint state="normal">Required</InputConstraint>}
        {maxLength && (
          <InputConstraint
            state={getLengthConstraintColor(value.length, maxLength)}
          >
            {value.length}/{maxLength}
          </InputConstraint>
        )}
      </InputLabel>
      {Object.prototype.hasOwnProperty.call(props, "children") ? (
        <FlexContainer>
          {input}
          {children}
        </FlexContainer>
      ) : (
        input
      )}
      {transition(
        (style, item) =>
          item && (
            <animated.div style={style}>
              <InputValidationError>
                <Icon>{error}</Icon>
                {item}
              </InputValidationError>
            </animated.div>
          ),
      )}
    </InputContainer>
  )
}

export const InputField = forwardRef(InputFieldRenderer)
