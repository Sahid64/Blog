"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

declare global {
  interface Window {
    loadPyodide: any;
  }
}

export default function OxyFenderPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>("");
  const pyodideRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    const loadGame = async () => {
      try {
        setProgress("Cargando Pyodide...");
        
        // Cargar script de Pyodide si no está cargado
        if (!window.loadPyodide) {
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
          script.async = true;
          document.head.appendChild(script);
          
          await new Promise((resolve, reject) => {
            script.onload = () => resolve(null);
            script.onerror = () => reject(new Error("Error al cargar Pyodide"));
            setTimeout(() => reject(new Error("Timeout cargando Pyodide")), 30000);
          });
        }

        if (!mounted) return;

        setProgress("Inicializando Python...");
        const pyodide = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
        });
        
        pyodideRef.current = pyodide;

        if (!mounted) return;

        setProgress("Instalando pygame...");
        await pyodide.loadPackage(["micropip"]);
        const micropip = pyodide.pyimport("micropip");
        
        // Instalar pygame (versión simplificada para web)
        setProgress("Instalando pygame-web...");
        try {
          await micropip.install("pygame");
        } catch (e) {
          // Si pygame no está disponible, continuamos con una implementación básica
          console.log("Pygame no disponible, usando implementación básica");
        }

        if (!mounted) return;

        // Configurar el canvas
        const canvas = canvasRef.current;
        if (!canvas) {
          throw new Error("Canvas no encontrado");
        }

        canvas.width = 1040;
        canvas.height = 550;

        setProgress("Configurando juego...");
        
        // Código Python del juego
        const gameCode = `
import sys
import pygame

# Configurar pygame
pygame.init()
screen = pygame.display.set_mode((1040, 550))

# Constantes
WIDTH = 1040
HEIGHT = 550
FPS = 60
PLAYER_VEL = 5
PLAYER_GRAVEDAD = 0.32
PLAYER_FUERZA_SALTO = -6
PLAYER_VELOCIDAD_MAXIMA_CAIDA = 2.5

# Colores
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
GREEN = (0, 255, 0)

class Player:
    def __init__(self, pos):
        self.rect = pygame.Rect(pos[0], pos[1], 30, 40)
        self.velocity_x = 0
        self.velocity_y = 0
        self.on_ground = False
        self.direction = "right"
        
    def update(self, keys, platforms):
        if keys[pygame.K_LEFT] or keys[pygame.K_a]:
            self.velocity_x = -PLAYER_VEL
            self.direction = "left"
        elif keys[pygame.K_RIGHT] or keys[pygame.K_d]:
            self.velocity_x = PLAYER_VEL
            self.direction = "right"
        else:
            self.velocity_x = 0
            
        self.rect.x += self.velocity_x
        self.rect.x = max(0, min(WIDTH - self.rect.width, self.rect.x))
        
        if (keys[pygame.K_SPACE] or keys[pygame.K_w] or keys[pygame.K_UP]) and self.on_ground:
            self.velocity_y = PLAYER_FUERZA_SALTO
            self.on_ground = False
            
        if not self.on_ground:
            self.velocity_y += PLAYER_GRAVEDAD
            if self.velocity_y > PLAYER_VELOCIDAD_MAXIMA_CAIDA:
                self.velocity_y = PLAYER_VELOCIDAD_MAXIMA_CAIDA
                
        self.rect.y += self.velocity_y
        self.on_ground = False
        
        for platform in platforms:
            if self.rect.colliderect(platform):
                if self.velocity_y > 0:
                    self.rect.bottom = platform.top
                    self.velocity_y = 0
                    self.on_ground = True
                elif self.velocity_y < 0:
                    self.rect.top = platform.bottom
                    self.velocity_y = 0
                    
        if self.rect.y > HEIGHT + 100:
            self.rect.x = 520
            self.rect.y = 300
            self.velocity_y = 0
            
    def draw(self, surface):
        color = (72, 187, 120) if self.direction == "right" else (56, 142, 60)
        pygame.draw.rect(surface, color, self.rect)
        pygame.draw.circle(surface, (100, 200, 100), 
                          (self.rect.centerx, self.rect.y + 10), 10)

# Plataformas
platforms = [
    pygame.Rect(0, 500, 1040, 50),
    pygame.Rect(150, 420, 180, 20),
    pygame.Rect(400, 360, 180, 20),
    pygame.Rect(650, 300, 180, 20),
    pygame.Rect(800, 240, 240, 20),
    pygame.Rect(200, 180, 150, 20),
    pygame.Rect(500, 120, 200, 20),
]

player = Player((520, 300))
clock = pygame.time.Clock()
running = True
oxygen = 100
score = 0
start_time = pygame.time.get_ticks()

font = pygame.font.Font(None, 36)
small_font = pygame.font.Font(None, 24)

while running:
    current_time = pygame.time.get_ticks()
    elapsed = (current_time - start_time) / 1000
    oxygen = max(0, 100 - (elapsed * 0.05))
    
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
            
    if not running:
        break
        
    keys = pygame.key.get_pressed()
    player.update(keys, platforms)
    
    if player.on_ground:
        score = int(elapsed * 10)
    
    # Fondo
    for y in range(HEIGHT):
        color_factor = y / HEIGHT
        color = (
            int(15 + color_factor * 10),
            int(20 + color_factor * 5),
            int(30 + color_factor * 5)
        )
        pygame.draw.line(screen, color, (0, y), (WIDTH, y))
    
    # Plataformas
    for platform in platforms:
        pygame.draw.rect(screen, (100, 100, 100), platform)
        pygame.draw.rect(screen, (150, 150, 150), platform, 2)
    
    player.draw(screen)
    
    # UI
    bar_width = 200
    bar_height = 20
    bar_x = WIDTH - bar_width - 20
    bar_y = 20
    
    pygame.draw.rect(screen, (45, 55, 72), (bar_x, bar_y, bar_width, bar_height))
    oxygen_width = (oxygen / 100) * bar_width
    oxygen_color = (72, 187, 120) if oxygen > 50 else (246, 173, 85) if oxygen > 25 else (252, 129, 129)
    pygame.draw.rect(screen, oxygen_color, (bar_x, bar_y, oxygen_width, bar_height))
    pygame.draw.rect(screen, (74, 85, 104), (bar_x, bar_y, bar_width, bar_height), 2)
    
    oxygen_text = small_font.render("Oxígeno", True, (226, 232, 240))
    screen.blit(oxygen_text, (bar_x, bar_y - 20))
    
    score_text = font.render(f"Score: {score}", True, WHITE)
    screen.blit(score_text, (20, 40))
    
    title_text = font.render("OxyFender", True, (203, 213, 225))
    screen.blit(title_text, (20, 70))
    
    pygame.display.flip()
    clock.tick(FPS)

pygame.quit()
`;

        // Ejecutar el juego
        setProgress("Iniciando juego...");
        await pyodide.runPythonAsync(gameCode);

        if (mounted) {
          setLoading(false);
          setProgress("");
        }
      } catch (err: any) {
        console.error("Error:", err);
        if (mounted) {
          setError(err.message || "Error al cargar el juego. Pygame puede no estar disponible en Pyodide. Usa la versión JavaScript.");
          setLoading(false);
        }
      }
    };

    loadGame();

    return () => {
      mounted = false;
      if (pyodideRef.current) {
        try {
          pyodideRef.current.runPython("pygame.quit()");
        } catch (e) {
          // Ignorar errores
        }
      }
    };
  }, []);

  return (
    <section className="w-full">
      <div className="mb-6">
        <Link
          href="/projects"
          className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
        >
          ← Volver a Proyectos
        </Link>
      </div>

      <h1 className="mb-4 text-3xl font-medium tracking-tight">OxyFender</h1>

      <p className="mb-6 tracking-tight text-neutral-600 dark:text-neutral-400">
        Juego educativo desarrollado en Python con Pygame. Este proyecto está diseñado para concienciar sobre la importancia de la restauración del clima y la preservación del oxígeno en nuestro planeta.
      </p>

      {loading && (
        <div className="flex flex-col items-center justify-center p-8 bg-neutral-100 dark:bg-neutral-800 rounded-lg mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">{progress || "Cargando el juego..."}</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-2">
            Esto puede tardar unos momentos la primera vez...
          </p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg mb-4">
          <p className="text-yellow-800 dark:text-yellow-200 font-semibold">Nota sobre Pygame en Pyodide:</p>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">
            Pygame completo no está disponible en Pyodide. El juego original de Python requiere pygame-ce, pytmx, y opencv-python, 
            que no son compatibles con el navegador.
          </p>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">
            Para jugar la versión completa del juego, descarga y ejecuta el código Python original desde GitHub.
          </p>
        </div>
      )}

      <div className="relative w-full bg-black rounded-lg overflow-hidden mb-4" style={{ aspectRatio: "1040/550" }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ display: loading || error ? "none" : "block" }}
        />
        {!loading && !error && (
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white p-2 rounded text-sm">
            <p>Controles: WASD o Flechas - Movimiento | SPACE o ↑ - Saltar</p>
          </div>
        )}
      </div>

      <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg mb-4">
        <h3 className="font-semibold mb-2 text-black dark:text-white">Controles:</h3>
        <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
          <li>• <strong>Flechas Izquierda/Derecha</strong> o <strong>A/D</strong> - Movimiento horizontal</li>
          <li>• <strong>Espacio</strong> o <strong>Flecha Arriba</strong> o <strong>W</strong> - Saltar</li>
          <li>• Mantén tu oxígeno alto moviéndote y evitando caer</li>
        </ul>
      </div>

      <div className="text-sm text-neutral-600 dark:text-neutral-400">
        <p>
          <Link
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black dark:hover:text-white transition-colors"
          >
            Ver código fuente completo en GitHub →
          </Link>
        </p>
        <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-500">
          <strong>Nota técnica:</strong> El juego original usa pygame-ce, pytmx y opencv-python, 
          que no son compatibles con Pyodide en el navegador. Esta versión es una adaptación simplificada 
          que ejecuta código Python en el navegador. Para la experiencia completa, ejecuta el juego original 
          con Python en tu máquina local.
        </p>
      </div>
    </section>
  );
}
