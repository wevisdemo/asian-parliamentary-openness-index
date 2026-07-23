{ pkgs ? import <nixpkgs> { } }:

pkgs.mkShell {
  packages = with pkgs; [
    moon
    nodejs_24
    pnpm
    uv
    python313
  ];
}
