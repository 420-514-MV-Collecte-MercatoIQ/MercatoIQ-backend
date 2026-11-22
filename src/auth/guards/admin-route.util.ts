import { PATH_METADATA } from "@nestjs/common/constants";

export function isAdminController(controllerClass: Function): boolean {
  const raw = Reflect.getMetadata(PATH_METADATA, controllerClass);
  const paths: string[] = Array.isArray(raw) ? raw : [raw ?? ""];
  return paths.some(
    (p) => p.replace(/^\/+/, "").split("/")[0].toLowerCase() === "admin",
  );
}
