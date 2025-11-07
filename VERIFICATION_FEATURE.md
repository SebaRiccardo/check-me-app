# Verificaciones Comunitarias - Documentación

## Descripción General

Sistema completo de verificaciones comunitarias que permite a los usuarios compartir y visualizar verificaciones de noticias. Incluye:

- ✅ Listado de verificaciones en tiempo real
- ✅ Formulario de creación con bottom sheet
- ✅ Subida de imágenes a Supabase Storage
- ✅ Hooks personalizados (sin TanStack Query)
- ✅ Validación de formularios con Zod
- ✅ UI responsive con NativeWind

## Estructura de Archivos

```
app/(tabs)/
  └── community.tsx              # Pantalla principal de verificaciones

components/
  ├── create-verification-form.tsx  # Formulario con bottom sheet
  ├── verification-card.tsx         # Card para mostrar verificaciones
  └── ui/
      ├── controlled-input.tsx      # Input controlado por react-hook-form
      ├── controlled-textarea.tsx   # TextArea controlado
      ├── controlled-select.tsx     # Selector de categorías
      └── textarea.tsx              # Componente base TextArea

hooks/
  └── use-verifications.ts       # Custom hooks para CRUD de verificaciones

types/
  └── verification.ts            # TypeScript types y constantes

supabase/migrations/
  └── create_verifications_table.sql  # Schema SQL completo
```

## Base de Datos

### Tabla: `verifications`

```sql
- id: UUID (PK)
- user_id: UUID (FK auth.users)
- title: TEXT
- description: TEXT
- news_id: TEXT (nullable)
- image_url: TEXT (nullable)
- category: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Storage Bucket: `verification-images`

- Bucket público para imágenes
- Estructura: `{user_id}/{timestamp}.{ext}`
- Políticas RLS configuradas

## Configuración Inicial

### 1. Ejecutar Migración SQL

Ejecuta el archivo SQL en el editor SQL de Supabase:

```bash
supabase/migrations/create_verifications_table.sql
```

O copia y pega el contenido en: Supabase Dashboard → SQL Editor → New Query

### 2. Verificar Storage Bucket

Ve a: Storage → Buckets → verification-images

Si no existe, la migración SQL lo crea automáticamente.

### 3. Permisos de Imagen Picker

El app solicita automáticamente permisos para galería de fotos en iOS/Android.

## Uso de Hooks

### `useVerifications()` - Obtener lista

```typescript
const { verifications, isLoading, error, refetch } = useVerifications();

// verifications: Verification[]
// isLoading: boolean
// error: Error | null
// refetch: () => Promise<void>
```

Incluye suscripción en tiempo real automática.

### `useCreateVerification()` - Crear verificación

```typescript
const { createVerification, isLoading, error } = useCreateVerification();

const handleCreate = async () => {
  const verification = await createVerification({
    user_id: userId,
    title: 'Título',
    description: 'Descripción...',
    news_id: null,
    category: 'Política',
    image_url: null,
  });
};
```

### `uploadVerificationImage()` - Subir imagen

```typescript
import { uploadVerificationImage } from '@/hooks/use-verifications';

const imageUrl = await uploadVerificationImage(userId, imageUri);
// Returns: string | null (public URL)
```

## Categorías Disponibles

```typescript
const VERIFICATION_CATEGORIES = [
  'Política',
  'Salud',
  'Tecnología',
  'Economía',
  'Ciencia',
  'Deportes',
  'Entretenimiento',
  'Otro',
];
```

## Componentes UI

### CreateVerificationForm

Bottom sheet con formulario completo:

```tsx
<CreateVerificationForm
  ref={bottomSheetRef}
  onSuccess={() => bottomSheetRef.current?.close()}
/>
```

**Props:**
- `onSuccess?: () => void` - Callback cuando se crea exitosamente

### VerificationCard

Card para mostrar una verificación:

```tsx
<VerificationCard verification={verification} />
```

**Muestra:**
- Imagen (si existe)
- Badge de categoría
- Título y descripción
- Metadata (autor, fecha)

## Validación de Formulario

Schema Zod aplicado:

```typescript
{
  title: min 5 caracteres
  description: min 20 caracteres
  news_id: opcional
  category: requerido (de la lista)
}
```

## Row Level Security (RLS)

### Políticas Configuradas:

1. **SELECT**: Todos pueden ver verificaciones
2. **INSERT**: Solo usuarios autenticados pueden crear
3. **UPDATE**: Solo el creador puede actualizar
4. **DELETE**: Solo el creador puede eliminar

### Storage Policies:

1. **SELECT**: Todos pueden ver imágenes
2. **INSERT**: Solo usuarios autenticados
3. **UPDATE/DELETE**: Solo el propietario (por user_id en path)

## Navegación

Nueva pestaña "Comunidad" en tab bar:

- Icono: Users (lucide-react-native)
- Ruta: `/community`
- Posición: Entre "Verificar" y "Perfil"

## Realtime

Las verificaciones se actualizan automáticamente usando Supabase Realtime:

```typescript
// En useVerifications()
const channel = supabase
  .channel('verifications-changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'verifications',
  }, () => {
    fetchVerifications();
  })
  .subscribe();
```

## Manejo de Errores

Todos los hooks incluyen manejo de errores:

```typescript
if (error) {
  return <ErrorState error={error} onRetry={refetch} />;
}
```

Estados de UI:
- **Loading**: Spinner con mensaje
- **Error**: Mensaje + botón reintentar
- **Empty**: Mensaje motivacional para crear primera verificación

## Optimizaciones

1. **FlashList**: Renderizado optimizado de listas largas
2. **RefreshControl**: Pull-to-refresh nativo
3. **Image Compression**: Quality 0.8 en ImagePicker
4. **Realtime Subscription**: Auto-refresh sin polling

## Próximos Pasos

- [ ] Agregar likes/reacciones a verificaciones
- [ ] Implementar comentarios
- [ ] Filtros por categoría
- [ ] Búsqueda de verificaciones
- [ ] Perfil de usuario con sus verificaciones
- [ ] Notificaciones push para nuevas verificaciones

## Troubleshooting

### Error: "Cannot read property 'expand' of null"

Asegúrate de que el ref esté correctamente asignado:

```tsx
const bottomSheetRef = useRef<BottomSheet>(null);
```

### Error: "Image upload failed"

Verifica:
1. Storage bucket existe
2. Políticas RLS están activas
3. Usuario está autenticado
4. URI de imagen es válida

### Error: "Gesture handler not found"

GestureHandlerRootView ya está configurado en `app/_layout.tsx`.

## Soporte

Para problemas o preguntas:
1. Revisa logs de Supabase Dashboard
2. Verifica políticas RLS en Table Editor
3. Consulta documentación de @gorhom/bottom-sheet
