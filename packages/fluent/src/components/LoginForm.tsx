import {
  Body1,
  MessageBarBody,
  Spinner,
  Subtitle1,
} from '@fluentui/react-components';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { SectionControlWrapper } from '../DataForm/SectionControl';
import { PasswordControl } from '../form/controls/PasswordControl';
import { TextControl } from '../form/controls/TextControl';
import { Button, MessageBar } from './fluent';

export interface LoginFormData {
  username: string;
  password: string;
}

const validationSchema: yup.ObjectSchema<LoginFormData> = yup
  .object<LoginFormData>()
  .shape({
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required'),
  });

const initialValues = {
  username: '',
  password: '',
};

interface LoginFormProps {
  logoImageUrl?: string;
  onLogin: (username: string, password: string) => Promise<void>;
  beforeLoginContent?: React.ReactNode;
  afterLoginContent?: React.ReactNode;
  subtitle?: string;
  defaultValues?: LoginFormData;
}

export function LoginForm(props: Readonly<LoginFormProps>) {
  const form = useForm<LoginFormData>({
    defaultValues: props.defaultValues ?? initialValues,
    resolver: yupResolver(validationSchema),
  });

  const handleOnSubmit = async (values: LoginFormData) => {
    form.clearErrors();

    try {
      await props.onLogin(
        values.username?.toLowerCase().trim(),
        values.password
      );
    } catch (error) {
      form.setError('root', {
        type: 'manual',
        message: (error as Error)?.message ?? 'An error occurred',
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleOnSubmit)}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'flex-start',
          gap: 16,
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
          }}
        >
          {!!props.logoImageUrl && (
            <img
              src={props.logoImageUrl}
              style={{
                width: 80,
                height: 80,
                aspectRatio: 'auto 80 / 80',
              }}
              alt="logo"
            />
          )}
        </div>
        <Subtitle1>Log in to your account</Subtitle1>
        {props.subtitle && <Body1>{props.subtitle}</Body1>}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            justifyContent: 'flex-start',
            gap: 16,
          }}
        >
          <Controller
            control={form.control}
            name="username"
            render={({ field, fieldState, formState }) => (
              <SectionControlWrapper
                label="Username"
                labelPosition="top"
                required
                isError={!!fieldState.error?.message && formState.isSubmitted}
                errorMessage={fieldState.error?.message}
              >
                <TextControl
                  placeholder="Username"
                  appearance="outline"
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  autoCapitalize="none"
                  autoCorrect="off"
                  error={!!fieldState.error?.message && formState.isSubmitted}
                />
              </SectionControlWrapper>
            )}
          />
          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState, formState }) => (
              <SectionControlWrapper
                label="Password"
                labelPosition="top"
                required
                isError={!!fieldState.error?.message && formState.isSubmitted}
                errorMessage={fieldState.error?.message}
              >
                <PasswordControl
                  placeholder="Password"
                  name={field.name}
                  appearance="outline"
                  error={!!fieldState.error?.message && formState.isSubmitted}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              </SectionControlWrapper>
            )}
          />
          {props.beforeLoginContent}
          {!!form.formState.errors.root && (
            <MessageBar intent="error">
              <MessageBarBody>
                {form.formState.errors.root.message}
              </MessageBarBody>
            </MessageBar>
          )}
          <Button
            appearance="primary"
            type="submit"
            style={{
              marginTop: 8,
              pointerEvents: form.formState.isSubmitting ? 'none' : 'auto',
            }}
          >
            {form.formState.isSubmitting && (
              <Spinner
                size="extra-tiny"
                appearance="inverted"
                style={{ marginRight: 4 }}
              />
            )}
            Login
          </Button>
          {props.afterLoginContent}
        </div>
        <div style={{ height: 80 }}></div>
      </div>
    </form>
  );
}
