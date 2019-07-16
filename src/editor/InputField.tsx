import React, { ChangeEvent } from "react"
import {
  Container,
  InputLabel,
  InputNote,
  MultilineTextInput,
  TextInput,
} from "./styles"

interface Props {
  id: string
  value?: string
  onChange: (value: string) => void
  label: string
  type?: string
  multiline?: boolean
  placeholder?: string
  maxLength?: number
}

type Event = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>

export default function InputField(props: Props) {
  const {
    id,
    value,
    onChange: handleChange,
    label,
    type,
    multiline,
    placeholder,
    maxLength,
  } = props

  const Input = multiline ? MultilineTextInput : TextInput

  const state = !maxLength
    ? "normal"
    : (value || "").length / maxLength < 0.9
    ? "normal"
    : (value || "").length / maxLength > 1
    ? "error"
    : "warning"

  return (
    <Container>
      <InputLabel htmlFor={id}>
        {label}
        <Input
          id={id}
          value={value || ""}
          onChange={(event: Event) => handleChange(event.target.value)}
          type={type || "text"}
          placeholder={placeholder}
        />
      </InputLabel>
      {maxLength && (
        <InputNote state={state}>
          {(value || "").length} / {maxLength}
        </InputNote>
      )}
    </Container>
  )
}
