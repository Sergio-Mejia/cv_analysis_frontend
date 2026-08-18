/** Contenedor uniforme para todo lo que devuelve la capa de servicios. */
export interface ApiResponse<T> {
  data: T;
  error: string | null;
}
