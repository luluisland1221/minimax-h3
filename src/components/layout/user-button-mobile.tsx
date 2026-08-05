'use client';

import { UserAvatar } from '@/components/layout/user-avatar';
import { useLocaleRouter } from '@/i18n/navigation';
import { Routes } from '@/routes';
import type { User } from 'better-auth';

interface UserButtonProps {
  user: User;
}

export function UserButtonMobile({ user }: UserButtonProps) {
  const router = useLocaleRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(Routes.Dashboard)}
      className="rounded-full outline-none ring-[#EC435B]/50 focus-visible:ring-2"
      aria-label="Open account center"
    >
      <UserAvatar
        name={user.name}
        image={user.image}
        className="size-8 cursor-pointer border"
      />
    </button>
  );
}
