/**
 * CardParse — Instancia centralizada de MMKV.
 *
 * Centralizamos la creación para:
 * - tener un único punto de inicialización
 * - poder cambiar la configuración en un solo lugar
 * - evitar importaciones inconsistentes en toda la app
 */
import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV();
