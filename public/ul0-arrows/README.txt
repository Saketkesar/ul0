UL0 ARROW LIBRARY - 98 hand-drawn doodle items x 3 colours (ink, coral, teal)
Folders (each has ink/ coral/ teal/):
  svg/            static, transparent, 200x200 viewBox
  svg-animated/   draw-on loop in pure CSS (dashed arrows march); respects reduced-motion
  webp-animated/  transparent animated WebP, 300px, ~2.5s loop (draw on, hold, fade)
  png/            transparent PNG, 600px
Families, each in 8 directions (right, down-right, down, down-left, left, up-left, up, up-right):
  straight, curved (-a/-b = bows either side), curly (loop, -a/-b), scurve (-a/-b), zigzag, dashed
Extras: uturn x4, spiral x2, double-headed x4, circle highlight x3, underline x3, x-mark, check, exclaim, question, sparkle x3, heart, burst x2
Name = family-direction: "curly-down-left-a" points DOWN-LEFT.
manifest.json: every item with "tip" = arrow tip position inside the 200x200 box (x,y). To aim an arrow at a target, place the image so its tip lands on the target:
  left = targetX - tipX*scale, top = targetY - tipY*scale  (scale = displayedSize/200)
Recolour an SVG by editing its stroke hex. alt="" for decorative use.
