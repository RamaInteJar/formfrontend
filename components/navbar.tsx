import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from '@nextui-org/navbar';
import { Button } from '@nextui-org/button';
import { Kbd } from '@nextui-org/kbd';
import { Link } from '@nextui-org/link';
import { Input } from '@nextui-org/react';

import { link as linkStyles } from '@nextui-org/theme';

import { siteConfig } from '@/config/site';
import NextLink from 'next/link';
import clsx from 'clsx';

import { ThemeSwitch } from '@/components/theme-switch';
import {
  TwitterIcon,
  GithubIcon,
  DiscordIcon,
  HeartFilledIcon,
  SearchIcon,
} from '@/components/icons';

import { Logo } from '@/components/icons';
import { useAuth } from '@/providers/authProvider';
import { useRouter } from 'next/navigation';
import {
  Dropdown,
  DropdownTrigger,
  Avatar,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react';

export const Navbar = () => {
  const { accessToken, logout, user } = useAuth();
  const router = useRouter();


  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: 'bg-default-100',
        input: 'text-sm',
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={['command']}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  return (
    <>
      {accessToken ? (
        <NextUINavbar maxWidth="full" position="sticky">
          <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
            <NavbarBrand as="li" className="gap-3 max-w-fit">
              <NextLink
                className="flex justify-start items-center gap-1"
                href="/"
              >
                <Logo />
                <p className="font-bold text-inherit">Faculty</p>
              </NextLink>
            </NavbarBrand>
            <ul className="hidden lg:flex gap-4 justify-start ml-2">
              {siteConfig.navItems.map((item) => (
                <NavbarItem key={item.href}>
                  <NextLink
                    className={clsx(
                      linkStyles({ color: 'foreground' }),
                      'data-[active=true]:text-primary data-[active=true]:font-medium'
                    )}
                    color="foreground"
                    href={item.href}
                  >
                    {item.label}
                  </NextLink>
                </NavbarItem>
              ))}
            </ul>
          </NavbarContent>

          <NavbarContent
            as="div"
            justify="end"
            className="hidden sm:flex basis-10/12 sm:basis-full"
          >
            <NavbarItem className="hidden sm:flex gap-2">
              <ThemeSwitch />
            </NavbarItem>
            <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="secondary"
                  name={user?.username}
                  size="sm"
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">{user?.username}</p>
                </DropdownItem>

                <DropdownItem
                  key="logout"
                  color="danger"
                  onClick={handleLogout}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarContent>

          <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
            <Link isExternal href={siteConfig.links.github} aria-label="Github">
              <GithubIcon className="text-default-500" />
            </Link>
            <ThemeSwitch />
            <NavbarMenuToggle />
          </NavbarContent>

          <NavbarMenu>
            {searchInput}
            <div className="mx-4 mt-2 flex flex-col gap-2">
              {siteConfig.navMenuItems.map((item, index) => (
                <NavbarMenuItem key={`${item}-${index}`}>
                  <Link
                    color={
                      index === 2
                        ? 'primary'
                        : index === siteConfig.navMenuItems.length - 1
                        ? 'danger'
                        : 'foreground'
                    }
                    href="#"
                    size="lg"
                  >
                    {item.label}
                  </Link>
                </NavbarMenuItem>
              ))}
            </div>
          </NavbarMenu>
        </NextUINavbar>
      ) : (
        ''
      )}
    </>
  );
};
