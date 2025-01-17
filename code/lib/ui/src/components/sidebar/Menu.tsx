import React, { useMemo, ComponentProps, FC } from 'react';

import { styled } from '@storybook/theming';
import { WithTooltip, TooltipLinkList, Button, Icons, IconButton } from '@storybook/components';

export type MenuList = ComponentProps<typeof TooltipLinkList>['links'];

const sharedStyles = {
  height: 10,
  width: 10,
  marginLeft: -5,
  marginRight: -5,
  display: 'block',
};

const Icon = styled(Icons)(sharedStyles, ({ theme }) => ({
  color: theme.color.secondary,
}));

const Img = styled.img(sharedStyles);
const Placeholder = styled.div(sharedStyles);

export interface ListItemIconProps {
  icon?: ComponentProps<typeof Icons>['icon'];
  imgSrc?: string;
}

export const MenuItemIcon = ({ icon, imgSrc }: ListItemIconProps) => {
  if (icon) {
    return <Icon icon={icon} />;
  }
  if (imgSrc) {
    return <Img src={imgSrc} alt="image" />;
  }
  return <Placeholder />;
};

export const MenuButton: FC<ComponentProps<typeof Button> & { highlighted: boolean }> = styled(
  Button
)<
  ComponentProps<typeof Button> & {
    highlighted: boolean;
  }
>(({ highlighted, theme }) => ({
  position: 'relative',
  overflow: 'visible',
  padding: 7,
  transition: 'none', // prevents button border from flashing when focused/blurred
  '&:focus': {
    background: theme.barBg,
    boxShadow: 'none',
  },
  // creates a pseudo border that does not affect the box model, but is accessible in high contrast mode
  '&:focus:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: '100%',
    border: `1px solid ${theme.color.secondary}`,
  },

  ...(highlighted && {
    '&:after': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      width: 8,
      height: 8,
      borderRadius: 8,
      background: theme.color.positive,
    },
  }),
}));

type ClickHandler = ComponentProps<typeof TooltipLinkList>['links'][number]['onClick'];

export const SidebarMenuList: FC<{
  menu: MenuList;
  onHide: () => void;
}> = ({ menu, onHide }) => {
  const links = useMemo(() => {
    return menu.map(({ onClick, ...rest }) => ({
      ...rest,
      onClick: ((event, item) => {
        if (onClick) {
          onClick(event, item);
        }
        onHide();
      }) as ClickHandler,
    }));
  }, [menu]);
  return <TooltipLinkList links={links} />;
};

export const SidebarMenu: FC<{
  menu: MenuList;
  isHighlighted: boolean;
}> = ({ isHighlighted, menu }) => {
  return (
    <WithTooltip
      placement="top"
      trigger="click"
      closeOnClick
      tooltip={({ onHide }) => <SidebarMenuList onHide={onHide} menu={menu} />}
    >
      <MenuButton outline small containsIcon highlighted={isHighlighted} title="Shortcuts">
        <Icons icon="ellipsis" />
      </MenuButton>
    </WithTooltip>
  );
};

export const ToolbarMenu: FC<{
  menu: MenuList;
}> = ({ menu }) => {
  return (
    <WithTooltip
      placement="bottom"
      trigger="click"
      closeOnClick
      tooltip={({ onHide }) => <SidebarMenuList onHide={onHide} menu={menu} />}
    >
      <IconButton title="Shortcuts" aria-label="Shortcuts">
        <Icons icon="menu" />
      </IconButton>
    </WithTooltip>
  );
};
