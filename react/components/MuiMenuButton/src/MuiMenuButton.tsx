import { Button, ButtonProps, Menu, MenuItem } from "@mui/material";
import React from "react";
import { v4 as uuidv4 } from "uuid";

type MenuButtonItem = {
  label: string;
  onClick: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
};

interface MenuButtonProps {
  ButtonComponent?: React.ElementType;
  children: React.ReactNode;
  itens: MenuButtonItem[];
}

type MappableMenuItem = {
  id: string;
} & MenuButtonItem;

/**
 * Botão que abre um menu do MUI e guarda a lógica de mostrar/esconder
 * o container
 *
 * @see https://mui.com/material-ui/react-menu/
 */
export const MuiMenuButton: React.FunctionComponent<
  MenuButtonProps & ButtonProps
> = ({ ButtonComponent = Button, children, itens, ...props }) => {
  const buttonId = React.useRef<string>(uuidv4()).current;
  const menuId = React.useRef<string>(uuidv4()).current;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    },
    []
  );

  const handleClose = React.useCallback(() => {
    setAnchorEl(null);
  }, []);

  const mappableItems = React.useMemo<MappableMenuItem[]>(
    () => itens.map((i) => ({ ...i, id: uuidv4() })),
    [itens]
  );

  return (
    <div>
      <ButtonComponent
        id={buttonId}
        aria-controls={open ? menuId : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        {...props}
      >
        {children}
      </ButtonComponent>

      <Menu
        id={menuId}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": buttonId,
        }}
      >
        {mappableItems.map((item) => (
          <MenuItem key={item.id} onClick={item.onClick}>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
