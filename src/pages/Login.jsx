import { useForm } from "@mantine/form"
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  Button,
  Stack,
  Center,
  Container,
  Space,
} from "@mantine/core"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/use-auth"
import { notifications } from "@mantine/notifications"

/**
 * When user is not logged in, they will be redirected to this page. Once they enter
 * the hardcoded login details they will be able to access the website.
 */
export function Login() {
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
    validate: {
      username: (value) => (value === "manager" ? null : "Invalid username!"),
      password: (value) => (value === "pword123" ? null : "Invalid password!"),
    },
  })
  const navigate = useNavigate()
  const location = useLocation()
  const auth = useAuth()

  function handleSubmit(values) {
    // TODO: send login request, redirect to / route if successful, otherwise show error
    if (form.isValid()) {
      auth.setUser("manager")
      navigate(location.state?.from?.pathname || "/", { replace: true })
    }
  }

  function handleErrors(errors) {
    if (errors.username || errors.password) {
      notifications.show({
        message: "Login failed, please try again.",
        color: "red",
        withBorder: true,
      })
    }
  }

  return (
    <Container
      style={{
        maxWidth: "360px",
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Text style={{ textAlign: "center" }} size="xl" fw={500}>
        Login
      </Text>
      <Space h="md" />
      <form onSubmit={form.onSubmit(handleSubmit, handleErrors)}>
        <Stack>
          <TextInput
            required
            label="Username"
            placeholder="Your username"
            {...form.getInputProps("username")}
            radius="md"
            size="md"
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            {...form.getInputProps("password")}
            radius="md"
            size="md"
          />
        </Stack>

        <Group justify="space-around" mt="xl">
          <Button fullWidth type="submit" radius="md" size="md">
            Login
          </Button>
        </Group>
      </form>
    </Container>
  )
}
