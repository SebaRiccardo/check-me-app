# Contexto de Verificaciones - Guía de Uso

## Descripción

El `VerificationsProvider` centraliza el estado y las operaciones CRUD de verificaciones usando React Context API, eliminando la necesidad de múltiples estados locales y proporcionando sincronización en tiempo real automática.

## Configuración

### 1. Provider en el layout principal

El provider ya está configurado en `app/_layout.tsx`:

```tsx
<VerificationsProvider autoSubscribe={true} autoFetch={true}>
  <SplashScreenController />
  <RootNavigator />
</VerificationsProvider>
```

**Props del Provider:**

- `autoSubscribe` (default: `true`): Suscribe automáticamente a cambios en tiempo real
- `autoFetch` (default: `true`): Hace fetch inicial de verificaciones al montar

## Uso Básico

### Hook Principal: `useVerificationsContext()`

```tsx
import { useVerificationsContext } from "@/providers/verifications-provider";

function MyComponent() {
  const {
    // Estado
    verifications, // VerificationWithProfile[]
    isLoading, // boolean
    error, // Error | null
    isSubscribed, // boolean

    // Acciones
    fetchVerifications, // (isRefreshing?: boolean) => Promise<void>
    refetch, // () => Promise<void>

    // Realtime
    subscribe, // () => RealtimeChannel
    unsubscribe, // () => void

    // CRUD
    createVerification, // (data) => Promise<VerificationWithProfile | null>
    updateVerification, // (id, updates) => Promise<VerificationWithProfile | null>
    deleteVerification, // (id) => Promise<boolean>
  } = useVerificationsContext();

  return (
    <View>
      {isLoading && <Text>Cargando...</Text>}
      {verifications.map((v) => (
        <VerificationCard key={v.id} verification={v} />
      ))}
    </View>
  );
}
```

## Ejemplos de Uso

### 1. Listar Verificaciones

```tsx
function VerificationsList() {
  const { verifications, isLoading, error, refetch } =
    useVerificationsContext();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return (
      <View>
        <Text>Error: {error.message}</Text>
        <Button onPress={refetch} title="Reintentar" />
      </View>
    );
  }

  return (
    <FlatList
      data={verifications}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <VerificationCard verification={item} />}
      refreshing={isLoading}
      onRefresh={refetch}
    />
  );
}
```

### 2. Crear Verificación

```tsx
function CreateVerificationForm() {
  const { createVerification } = useVerificationsContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: VerificationInsert) => {
    setIsSubmitting(true);

    const result = await createVerification(data);

    if (result) {
      console.log("Verificación creada:", result.id);
      // La verificación aparecerá automáticamente en la lista
      // gracias a la suscripción en tiempo real
    }

    setIsSubmitting(false);
  };

  return <Form onSubmit={handleSubmit} disabled={isSubmitting} />;
}
```

### 3. Actualizar Verificación

```tsx
function VerificationCard({
  verification,
}: {
  verification: VerificationWithProfile;
}) {
  const { updateVerification } = useVerificationsContext();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);

    const result = await updateVerification(verification.id, {
      status: newStatus,
    });

    if (result) {
      console.log("Verificación actualizada");
      // El estado se actualiza automáticamente
    }

    setIsUpdating(false);
  };

  return (
    <Card>
      <Text>{verification.title}</Text>
      <Button
        onPress={() => handleStatusChange("verified")}
        disabled={isUpdating}
      >
        Marcar como verificado
      </Button>
    </Card>
  );
}
```

### 4. Eliminar Verificación

```tsx
function DeleteButton({ verificationId }: { verificationId: string }) {
  const { deleteVerification } = useVerificationsContext();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = await confirm("¿Estás seguro?");
    if (!confirmed) return;

    setIsDeleting(true);

    const success = await deleteVerification(verificationId);

    if (success) {
      console.log("Verificación eliminada");
      // Se elimina automáticamente de la lista
    }

    setIsDeleting(false);
  };

  return (
    <Button onPress={handleDelete} disabled={isDeleting} variant="destructive">
      Eliminar
    </Button>
  );
}
```

### 5. Suscripción Manual (Avanzado)

Si necesitas control total sobre la suscripción:

```tsx
function ManualSubscriptionComponent() {
  const { subscribe, unsubscribe, isSubscribed } = useVerificationsContext();

  useEffect(() => {
    // Solo suscribirse cuando el componente esté visible
    if (isVisible && !isSubscribed) {
      const channel = subscribe();

      return () => {
        // Limpieza manual
        supabase.removeChannel(channel);
      };
    }
  }, [isVisible, isSubscribed]);

  // O usar el método unsubscribe del contexto
  const handleUnsubscribe = () => {
    unsubscribe();
  };

  return (
    <View>
      <Text>Estado de suscripción: {isSubscribed ? "Activo" : "Inactivo"}</Text>
      <Button onPress={handleUnsubscribe}>Desuscribir</Button>
    </View>
  );
}
```

## Hooks Deprecados (Compatibilidad)

Los siguientes hooks aún funcionan pero están marcados como deprecados. Se recomienda usar `useVerificationsContext()` directamente:

```tsx
// ❌ Deprecado
import {
  useVerifications,
  useCreateVerification,
} from "@/hooks/use-verifications";

const { verifications, isLoading } = useVerifications();
const { createVerification } = useCreateVerification();

// ✅ Recomendado
import { useVerificationsContext } from "@/providers/verifications-provider";

const { verifications, isLoading, createVerification } =
  useVerificationsContext();
```

## Características Principales

### ✅ Estado Único y Compartido

- Todos los componentes comparten el mismo estado de verificaciones
- No hay duplicación de datos ni sincronización manual necesaria

### ✅ Realtime Automático

- Las operaciones CRUD se sincronizan automáticamente en tiempo real
- Los cambios de otros usuarios aparecen instantáneamente
- Actualización optimista del estado local

### ✅ Gestión de Errores

- Errores capturados y expuestos en el contexto
- Reintentos fáciles con `refetch()`

### ✅ Performance

- Actualización granular del estado (no refetch completo)
- Fetch inicial configurable
- Suscripción opcional para componentes que no la necesiten

## Configuración Avanzada

### Provider sin Auto-fetch ni Auto-subscribe

```tsx
// Útil para tests o casos específicos
<VerificationsProvider autoSubscribe={false} autoFetch={false}>
  {children}
</VerificationsProvider>
```

### Control Manual Completo

```tsx
function CustomComponent() {
  const { fetchVerifications, subscribe, unsubscribe, isSubscribed } =
    useVerificationsContext();

  useEffect(() => {
    // Fetch manual cuando el usuario lo requiera
    fetchVerifications();
  }, []);

  const handleToggleRealtime = () => {
    if (isSubscribed) {
      unsubscribe();
    } else {
      subscribe();
    }
  };

  return (
    <Button onPress={handleToggleRealtime}>
      {isSubscribed ? "Desactivar" : "Activar"} Tiempo Real
    </Button>
  );
}
```

## Tipos

```typescript
type VerificationWithProfile = Verification & {
  profiles: {
    avatar_url: string | null;
    full_name: string | null;
    username: string | null;
  } | null;
};

interface VerificationsContextValue {
  verifications: VerificationWithProfile[];
  isLoading: boolean;
  error: Error | null;
  isSubscribed: boolean;

  fetchVerifications: (isRefreshing?: boolean) => Promise<void>;
  refetch: () => Promise<void>;

  subscribe: () => RealtimeChannel;
  unsubscribe: () => void;

  createVerification: (
    verification: VerificationInsert,
  ) => Promise<VerificationWithProfile | null>;
  updateVerification: (
    id: string,
    updates: VerificationUpdate,
  ) => Promise<VerificationWithProfile | null>;
  deleteVerification: (id: string) => Promise<boolean>;
}
```

## Migración desde Hooks Antiguos

### Antes

```tsx
function MyComponent() {
  const { verifications, isLoading } = useVerifications();
  const { createVerification } = useCreateVerification();
  const { updateVerification } = useUpdateVerification();
  const { deleteVerification } = useDeleteVerification();

  // Cada hook tiene su propio estado de loading y error
}
```

### Después

```tsx
function MyComponent() {
  const {
    verifications,
    isLoading,
    error,
    createVerification,
    updateVerification,
    deleteVerification,
  } = useVerificationsContext();

  // Todo centralizado en un solo hook
}
```

## Notas Importantes

1. **Provider Required**: Asegúrate de que el componente esté dentro del `VerificationsProvider`
2. **Realtime Optimizado**: Las operaciones CRUD actualizan el estado local automáticamente cuando hay suscripción activa
3. **Cleanup Automático**: El provider se encarga de limpiar las suscripciones al desmontar
4. **Perfiles Automáticos**: Los perfiles de usuario se obtienen automáticamente para cada verificación
