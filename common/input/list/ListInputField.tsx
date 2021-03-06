import { animated, useTransition } from "@react-spring/web"
import React, { Fragment } from "react"
import styled from "styled-components"
import { chevron, chevronDown } from "../../../icons/chevron"
import { error } from "../../../icons/error"
import { Action, ActionButtons } from "../../layout/ActionButtons"
import { Icon } from "../../layout/Icon"
import { Button } from "../button/Button"
import { Input } from "../layout/Input"
import { InputConstraint } from "../layout/InputConstraint"
import { InputContainer } from "../layout/InputContainer"
import { InputLabel } from "../layout/InputLabel"
import { InputValidationError } from "../layout/InputValidationError"

const Grid = styled.div<{ hasActions: boolean }>`
  display: grid;
  grid-template-columns: 1fr min-content;
  align-items: center;
  gap: ${({ hasActions }) => (hasActions ? "8px 16px" : "8px 0")};

  & ${Button} {
    margin-left: 0;
    justify-self: start;
  }
`

export type ListInputFieldProps = {
  id: string
  value: string[]
  onChange: (value: string[]) => void
  label: {
    singular: string
    plural: string
  }
  limit?: number
  error?: string
}

export function ListInputField(props: ListInputFieldProps) {
  const {
    id,
    value: values,
    onChange: handleChange,
    label,
    limit,
    error: validationError,
  } = props

  const moveUp = (index: number) => {
    const clone = Array.from(values)
    clone.splice(index - 1, 0, ...clone.splice(index, 1))
    handleChange(clone)
  }

  const moveDown = (index: number) => {
    const clone = Array.from(values)
    clone.splice(index + 1, 0, ...clone.splice(index, 1))
    handleChange(clone)
  }

  const removeItem = (index: number) => {
    const clone = Array.from(values)
    clone.splice(index, 1)
    handleChange(clone)
  }

  const inputs = values.map((value, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <Fragment key={index}>
      <Input
        id={`${id}_${index}`}
        value={value}
        aria-label={`${label.singular} ${index + 1}`}
        onChange={event => {
          if (!event.target.value) {
            event.target.blur()
            removeItem(index)
            return
          }

          const copy = Array.from(values)
          copy[index] = event.target.value
          handleChange(copy)
        }}
      />
      <ActionButtons
        actions={[
          index !== 0 && {
            icon: chevron,
            label: "Move up",
            handler: () => moveUp(index),
          },
          index + 1 !== values.length && {
            icon: chevronDown,
            label: "Move down",
            handler: () => moveDown(index),
          },
        ].filter((action): action is Action => {
          return typeof action === "object"
        })}
      />
    </Fragment>
  ))

  const canAdd = !limit || values.length < limit
  if (canAdd) {
    inputs.push(
      <Fragment key={values.length}>
        <Input
          id={`${id}_${values.length}`}
          value=""
          aria-label={`${label.singular} ${values.length + 1}`}
          onChange={event => {
            handleChange([...values, event.target.value])
          }}
        />
      </Fragment>,
    )
  }

  const transition = useTransition(validationError, {
    key: validationError,
    config: { tension: 300, clamp: true },
    from: { opacity: (0 as unknown) as undefined, height: 0 },
    enter: { opacity: (1 as unknown) as undefined, height: 24 },
    leave: { opacity: (0 as unknown) as undefined, height: 0 },
  })

  return (
    <InputContainer>
      <InputLabel>
        {label.plural}
        {limit && (
          <InputConstraint>
            {values.length}/{limit}
          </InputConstraint>
        )}
      </InputLabel>
      <Grid hasActions={inputs.length - Number(canAdd) > 1}>{inputs}</Grid>
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
