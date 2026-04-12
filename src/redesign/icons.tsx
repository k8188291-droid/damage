/* Line-style SVG icons for the redesign. 16x16 by default, 1.5 stroke. */
import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size: number): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: '0 0 16 16',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.25,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
});

export function IconFolder({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M1.5 4.5 A1 1 0 0 1 2.5 3.5 H6 l1.5 1.5 H13.5 A1 1 0 0 1 14.5 6 V11.5 A1 1 0 0 1 13.5 12.5 H2.5 A1 1 0 0 1 1.5 11.5 Z" />
    </svg>
  );
}

export function IconUser({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <circle cx="8" cy="5.5" r="2.5" />
      <path d="M2.5 13.5 C3.5 10.5 6 9.5 8 9.5 S12.5 10.5 13.5 13.5" />
    </svg>
  );
}

export function IconSword({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M13.5 2.5 L13.5 5.5 L7 12 L5 12 L4 13 L3 12 L4 11 L4 9 L10.5 2.5 Z" />
      <path d="M5 12 L4 13" />
    </svg>
  );
}

export function IconSpark({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M8 1.5 L9 6.5 L14 8 L9 9.5 L8 14.5 L7 9.5 L2 8 L7 6.5 Z" />
    </svg>
  );
}

export function IconGear({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <circle cx="8" cy="8" r="2.25" />
      <path d="M8 1.5 V3 M8 13 V14.5 M1.5 8 H3 M13 8 H14.5 M3.3 3.3 L4.4 4.4 M11.6 11.6 L12.7 12.7 M3.3 12.7 L4.4 11.6 M11.6 4.4 L12.7 3.3" />
    </svg>
  );
}

export function IconSearch({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <circle cx="7" cy="7" r="4.5" />
      <path d="M10.5 10.5 L14 14" />
    </svg>
  );
}

export function IconChevronRight({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M6 3 L11 8 L6 13" />
    </svg>
  );
}

export function IconChevronDown({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M3 6 L8 11 L13 6" />
    </svg>
  );
}

export function IconClose({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M3.5 3.5 L12.5 12.5 M12.5 3.5 L3.5 12.5" />
    </svg>
  );
}

export function IconPlus({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M8 3 V13 M3 8 H13" />
    </svg>
  );
}

export function IconCopy({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <rect x="4.5" y="4.5" width="9" height="9" rx="0.5" />
      <path d="M11.5 4.5 V3 A0.5 0.5 0 0 0 11 2.5 H3 A0.5 0.5 0 0 0 2.5 3 V11 A0.5 0.5 0 0 0 3 11.5 H4.5" />
    </svg>
  );
}

export function IconTrash({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M2.5 4 H13.5 M6 4 V2.5 H10 V4 M4 4 L4.5 13.5 H11.5 L12 4" />
    </svg>
  );
}

export function IconGrip({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <circle cx="6" cy="4" r="0.6" fill="currentColor" />
      <circle cx="10" cy="4" r="0.6" fill="currentColor" />
      <circle cx="6" cy="8" r="0.6" fill="currentColor" />
      <circle cx="10" cy="8" r="0.6" fill="currentColor" />
      <circle cx="6" cy="12" r="0.6" fill="currentColor" />
      <circle cx="10" cy="12" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function IconCalculator({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <rect x="3" y="2" width="10" height="12" rx="0.5" />
      <rect x="4.5" y="3.5" width="7" height="2.5" />
      <circle cx="5.5" cy="8.5" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="8" cy="8.5" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="10.5" cy="8.5" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="5.5" cy="11" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="8" cy="11" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="10.5" cy="11" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Tiny L-shape section marker (seen on the reference in panel titles) */
export function IconSectionMark({ size = 10, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p} strokeWidth={1.5}>
      <path d="M2 2 V8 H10" />
    </svg>
  );
}

/** Diamond "new/updated" indicator */
export function IconDiamond({ size = 10, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p} strokeWidth={1.5}>
      <path d="M5 1 L9 5 L5 9 L1 5 Z" fill="currentColor" stroke="none" />
    </svg>
  );
}
