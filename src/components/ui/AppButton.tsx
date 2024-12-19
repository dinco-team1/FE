import { ReactNode } from "react";
import * as S from "./appButtonStyle";

export default function AppButton(
  children: ReactNode,
  { onClickFnc, type = "button", style = "default" }: IAppButtonProps,
) {
  return (
    <S.Button onClick={onClickFnc} type={type} $style={style}>
      {children}
    </S.Button>
  );
}
