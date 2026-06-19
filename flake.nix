{
  description = "Development environment for lint-plugin-ryoppippi";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    nix-vite-plus.url = "github:ryoppippi/nix-vite-plus";
  };

  outputs =
    {
      nixpkgs,
      nix-vite-plus,
      ...
    }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];
      nodeVersion = nixpkgs.lib.removeSuffix "\n" (builtins.readFile ./.node-version);
      nodeMajor = nixpkgs.lib.versions.major nodeVersion;
      forAllSystems = nixpkgs.lib.genAttrs systems;
    in
    {
      devShells = forAllSystems (
        system:
        let
          pkgs = import nixpkgs { inherit system; };
          nodejs = pkgs.${"nodejs_${nodeMajor}"};
        in
        {
          default = pkgs.mkShellNoCC {
            packages = [
              nodejs
              nix-vite-plus.packages.${system}.vp
              pkgs.yq-go
            ];
          };
        }
      );

      formatter = forAllSystems (system: nixpkgs.legacyPackages.${system}.nixfmt-tree);
    };
}
