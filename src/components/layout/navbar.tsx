'use client';

import { LoginWrapper } from '@/components/auth/login-wrapper';
import Container from '@/components/layout/container';
import { Logo } from '@/components/layout/logo';
import { ModeSwitcher } from '@/components/layout/mode-switcher';
import { NavbarMobile } from '@/components/layout/navbar-mobile';
import { UserButton } from '@/components/layout/user-button';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { getNavbarLinks } from '@/config/navbar-config';
import { useScroll } from '@/hooks/use-scroll';
import { LocaleLink, useLocalePathname } from '@/i18n/navigation';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { Routes } from '@/routes';
import { ArrowUpRightIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Skeleton } from '../ui/skeleton';
import LocaleSwitcher from './locale-switcher';

interface NavBarProps {
  scroll?: boolean;
}

const customNavigationMenuTriggerStyle = cn(
  navigationMenuTriggerStyle(),
  'relative cursor-pointer bg-transparent',
  'data-active:bg-transparent data-active:font-semibold'
);

export function Navbar({ scroll }: NavBarProps) {
  const t = useTranslations();
  const scrolled = useScroll(50);
  const menuLinks = getNavbarLinks();
  const localePathname = useLocalePathname();
  const [mounted, setMounted] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const currentUser = session?.user;
  const useDarkNavbar = Boolean(scroll && scrolled);
  const navigationContrastClass = useDarkNavbar
    ? 'text-white/65 hover:bg-white/8 hover:text-white focus:bg-white/8 focus:text-white data-active:text-white data-[state=open]:bg-white/8 data-[state=open]:text-white'
    : 'text-[#30272d]/60 hover:bg-black/5 hover:text-[#171216] focus:bg-black/5 focus:text-[#171216] data-active:text-[#171216] data-[state=open]:bg-black/5 data-[state=open]:text-[#171216]';
  // console.log(`Navbar, user:`, user);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      className={cn(
        'sticky inset-x-0 top-0 z-40 py-3 transition-all duration-300',
        scroll
          ? scrolled
            ? 'border-b border-white/10 bg-[#0b090b]/92 shadow-[0_12px_40px_rgba(0,0,0,.28)] backdrop-blur-xl supports-backdrop-filter:bg-[#0b090b]/82'
            : 'bg-transparent'
          : 'border-b bg-muted/50'
      )}
    >
      <Container className="px-4">
        {/* desktop navbar */}
        <nav className="hidden lg:flex">
          {/* logo and name */}
          <div className="flex items-center">
            <LocaleLink href="/" className="flex items-center space-x-2">
              <Logo />
              <span
                className={cn(
                  'text-xl font-semibold transition-colors',
                  useDarkNavbar ? 'text-white' : 'text-[#171216]'
                )}
              >
                {t('Metadata.name')}
              </span>
            </LocaleLink>
          </div>

          {/* menu links */}
          <div className="flex-1 flex items-center justify-center space-x-2">
            <NavigationMenu className="relative">
              <NavigationMenuList className="flex items-center">
                {menuLinks?.map((item, index) =>
                  item.items ? (
                    <NavigationMenuItem key={index} className="relative">
                      <NavigationMenuTrigger
                        data-active={
                          item.items.some((subItem) =>
                            subItem.href
                              ? localePathname.startsWith(subItem.href)
                              : false
                          )
                            ? 'true'
                            : undefined
                        }
                        className={cn(
                          customNavigationMenuTriggerStyle,
                          navigationContrastClass
                        )}
                      >
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-4 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                          {item.items?.map((subItem, subIndex) => {
                            const isSubItemActive =
                              subItem.href &&
                              localePathname.startsWith(subItem.href);
                            return (
                              <li key={subIndex}>
                                <NavigationMenuLink asChild>
                                  <LocaleLink
                                    href={subItem.href || '#'}
                                    target={
                                      subItem.external ? '_blank' : undefined
                                    }
                                    rel={
                                      subItem.external
                                        ? 'noopener noreferrer'
                                        : undefined
                                    }
                                    className={cn(
                                      'group flex select-none flex-row items-center gap-4 rounded-md',
                                      'p-2 leading-none no-underline outline-hidden transition-colors',
                                      'hover:bg-accent hover:text-accent-foreground',
                                      'focus:bg-accent focus:text-accent-foreground',
                                      isSubItemActive &&
                                        'bg-accent text-accent-foreground'
                                    )}
                                  >
                                    <div
                                      className={cn(
                                        'flex size-8 shrink-0 items-center justify-center transition-colors',
                                        'bg-transparent text-muted-foreground',
                                        'group-hover:bg-transparent group-hover:text-accent-foreground',
                                        'group-focus:bg-transparent group-focus:text-accent-foreground',
                                        isSubItemActive &&
                                          'bg-transparent text-accent-foreground'
                                      )}
                                    >
                                      {subItem.icon ? subItem.icon : null}
                                    </div>
                                    <div className="flex-1">
                                      <div
                                        className={cn(
                                          'text-sm font-medium text-muted-foreground',
                                          'group-hover:bg-transparent group-hover:text-accent-foreground',
                                          'group-focus:bg-transparent group-focus:text-accent-foreground',
                                          isSubItemActive &&
                                            'bg-transparent text-accent-foreground'
                                        )}
                                      >
                                        {subItem.title}
                                      </div>
                                      {subItem.description && (
                                        <div
                                          className={cn(
                                            'text-sm text-muted-foreground',
                                            'group-hover:bg-transparent group-hover:text-accent-foreground/80',
                                            'group-focus:bg-transparent group-focus:text-accent-foreground/80',
                                            isSubItemActive &&
                                              'bg-transparent text-accent-foreground/80'
                                          )}
                                        >
                                          {subItem.description}
                                        </div>
                                      )}
                                    </div>
                                    {subItem.external && (
                                      <ArrowUpRightIcon
                                        className={cn(
                                          'size-4 shrink-0 text-muted-foreground',
                                          'group-hover:bg-transparent group-hover:text-accent-foreground',
                                          'group-focus:bg-transparent group-focus:text-accent-foreground',
                                          isSubItemActive &&
                                            'bg-transparent text-accent-foreground'
                                        )}
                                      />
                                    )}
                                  </LocaleLink>
                                </NavigationMenuLink>
                              </li>
                            );
                          })}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ) : (
                    <NavigationMenuItem key={index}>
                      <NavigationMenuLink
                        asChild
                        active={
                          item.href
                            ? item.href === '/'
                              ? localePathname === '/'
                              : localePathname.startsWith(item.href)
                            : false
                        }
                        className={cn(
                          customNavigationMenuTriggerStyle,
                          navigationContrastClass
                        )}
                      >
                        <LocaleLink
                          href={item.href || '#'}
                          target={item.external ? '_blank' : undefined}
                          rel={
                            item.external ? 'noopener noreferrer' : undefined
                          }
                        >
                          {item.title}
                        </LocaleLink>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* navbar right show sign in or user */}
          <div className="flex items-center gap-x-4">
            {!mounted || isPending ? (
              <Skeleton className="size-8 border rounded-full" />
            ) : currentUser ? (
              <>
                {/* <CreditsBalanceButton /> */}
                <UserButton user={currentUser} />
              </>
            ) : (
              <div className="flex items-center gap-x-4">
                <LoginWrapper mode="modal" asChild callbackUrl={localePathname}>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      'cursor-pointer transition-colors',
                      useDarkNavbar
                        ? 'border-white/20 bg-white/8 text-white hover:bg-white/15 hover:text-white'
                        : 'border-black/15 bg-white text-[#171216] hover:bg-black/5 hover:text-[#171216]'
                    )}
                  >
                    {t('Common.login')}
                  </Button>
                </LoginWrapper>

                <LocaleLink
                  href={`${Routes.Register}?callbackUrl=${encodeURIComponent(localePathname)}`}
                  className={cn(
                    buttonVariants({
                      variant: 'default',
                      size: 'sm',
                    })
                  )}
                >
                  {t('Common.signUp')}
                </LocaleLink>
              </div>
            )}

            <ModeSwitcher />
            <LocaleSwitcher />
          </div>
        </nav>

        {/* mobile navbar */}
        <NavbarMobile className="lg:hidden" />
      </Container>
    </section>
  );
}
