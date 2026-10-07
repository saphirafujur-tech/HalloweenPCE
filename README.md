# Halloween PCE · The Cursed Academy

Videojuego educativo de Halloween para PCE, preparado para alojarse directamente en **GitHub Pages**.

## Mundos incluidos

1. Matemáticas II · Pumpkin Dungeon · Determinantes
2. Biología Y12 · Candy Lab · Glúcidos
3. Química Y12 · Witch Molecular Lab · Enlace químico
4. Física Y13 · Radioactive Pumpkin · Radiactividad
5. Matemáticas CCSS · Trick or Treat Loot Box · Probabilidad
6. Final Boss

## Cómo publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub.
2. Sube `index.html`, `styles.css`, `questions.js` y `game.js` a la raíz.
3. En el repositorio abre **Settings → Pages**.
4. En *Build and deployment*, selecciona **Deploy from a branch**.
5. Elige `main` y carpeta `/ (root)`.
6. Guarda. GitHub te mostrará la URL del juego.

## Cómo editar preguntas

Abre `questions.js`.

Cada pregunta tiene este formato:

```js
{
  q: 'Pregunta',
  a: ['Respuesta A','Respuesta B','Respuesta C','Respuesta D'],
  correct: 2,
  explain: 'Explicación que aparece después.'
}
```

`correct` empieza en 0: 0=A, 1=B, 2=C, 3=D.

## Mecánicas

- 3 vidas
- +100 XP por respuesta correcta
- +250 XP por mundo completado
- 1 llave por mundo
- Boss final bloqueado hasta tener 5 llaves
- +1000 XP al derrotar al Boss
- Progreso guardado automáticamente con `localStorage`

## Personalización

La estética usa fondo oscuro, verde neón y naranja. No necesita backend ni dependencias de JavaScript. Las fuentes de Google Fonts son opcionales: si el centro bloquea acceso externo, el juego sigue funcionando con fuentes de respaldo.
