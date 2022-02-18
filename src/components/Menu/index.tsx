// eslint-disable-next-line no-restricted-imports
import { t, Trans } from '@lingui/macro'
import { PrivacyPolicyModal } from 'components/PrivacyPolicy'
import { LOCALE_LABEL, SUPPORTED_LOCALES, SupportedLocale } from 'constants/locales'
import { useActiveLocale } from 'hooks/useActiveLocale'
import { useLocationLinkProps } from 'hooks/useLocationLinkProps'
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDarkModeManager } from 'state/user/hooks'
import styled, { css } from 'styled-components/macro'

import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { useModalOpen, useToggleModal } from '../../state/application/hooks'
import { ApplicationModal } from '../../state/application/reducer'
import { ExternalLink } from '../../theme'
import { ArrowLeft, Book, Check, Globe, InfoCircle, ListUl, Moon, QuestionCircle, Sun } from '../../components/FontawesomeIcon'

export enum FlyoutAlignment {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

const StyledMenuIcon = styled(ListUl)`
  path {
    stroke: ${({ theme }) => theme.text1};
  }
`

const StyledMenuButton = styled.button`
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 40px;
  background-color: ${({ theme }) => theme.bg0};
  border: 1px solid ${({ theme }) => theme.bg0};
  padding: 0.15rem 0.5rem;
  border-radius: 16px;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    border: 1px solid ${({ theme }) => theme.bg3};
  }

  svg {
    margin-top: 2px;
  }
`

const StyledMenu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

const MenuFlyout = styled.span<{ flyoutAlignment?: FlyoutAlignment }>`
  min-width: 196px;
  max-height: 350px;
  overflow: auto;
  background-color: ${({ theme }) => theme.bg1};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
  0px 24px 32px rgba(0, 0, 0, 0.01);
  border: 1px solid ${({ theme }) => theme.bg0};
  border-radius: 12px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  position: absolute;
  top: 3rem;
  z-index: 100;

  ${({ flyoutAlignment = FlyoutAlignment.RIGHT }) =>
          flyoutAlignment === FlyoutAlignment.RIGHT
                  ? css`
                    right: 0rem;
                  `
                  : css`
                    left: 0rem;
                  `};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    bottom: unset;
    right: 0;
    left: unset;
  `};
`

const MenuItem = styled(ExternalLink)`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  padding: 0.5rem 0.5rem;
  justify-content: space-between;
  color: ${({ theme }) => theme.text2};

  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
  }
`

const InternalMenuItem = styled(Link)`
  flex: 1;
  padding: 0.5rem 0.5rem;
  color: ${({ theme }) => theme.text2};

  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
  }

  > svg {
    margin-right: 8px;
  }
`

const InternalLinkMenuItem = styled(InternalMenuItem)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.5rem 0.5rem;
  justify-content: space-between;
  text-decoration: none;

  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
  }
`

const ToggleMenuItem = styled.button`
  background-color: transparent;
  margin: 0;
  padding: 0;
  border: none;
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  padding: 0.5rem 0.5rem;
  justify-content: space-between;
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text2};

  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
  }
`

export function LanguageMenuItem({ locale, active }: { locale: SupportedLocale; active: boolean }) {
  const { to, onClick } = useLocationLinkProps(locale)

  if (!to) return null

  return (
    <InternalLinkMenuItem onClick={onClick} to={to}>
      <div>{LOCALE_LABEL[locale]}</div>
      {active && <Check opacity={0.6} />}
    </InternalLinkMenuItem>
  )
}

function LanguageMenu({ close }: { close: () => void }) {
  const activeLocale = useActiveLocale()

  return (
    <MenuFlyout>
      <ToggleMenuItem onClick={close}>
        <ArrowLeft />
      </ToggleMenuItem>
      {SUPPORTED_LOCALES.map((locale, index) => (
        <LanguageMenuItem key={index} locale={locale} active={activeLocale === locale} />
      ))}
    </MenuFlyout>
  )
}

export default function Menu() {

  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.MENU)
  const toggleMenu = useToggleModal(ApplicationModal.MENU)
  useOnClickOutside(node, open ? toggleMenu : undefined)
  //const togglePrivacyPolicy = useToggleModal(ApplicationModal.PRIVACY_POLICY)
  //const openClaimModal = useToggleModal(ApplicationModal.ADDRESS_CLAIM)
  //const showUNIClaimOption = Boolean(!!account && !!chainId && !L2_CHAIN_IDS.includes(chainId))

  const [darkMode, toggleDarkMode] = useDarkModeManager()

  const [menu, setMenu] = useState<'main' | 'lang'>('main')

  useEffect(() => {
    setMenu('main')
  }, [open])

  return (
    <>
      {/* // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451 */}
      <StyledMenu ref={node as any}>
        <StyledMenuButton onClick={toggleMenu} aria-label={t`Menu`}>
          <StyledMenuIcon />
        </StyledMenuButton>

        {open &&
        (() => {
          switch (menu) {
            case 'lang':
              return <LanguageMenu close={() => setMenu('main')} />
            case 'main':
            default:
              return (
                <MenuFlyout>
                  <MenuItem href="https://web3dao.notion.site/web3dao/Web3-Wiki-86f9cf927cbe49129d243dd66f27a638">
                    <div>
                      <Trans>About</Trans>
                    </div>
                    <InfoCircle opacity={0.6} />
                  </MenuItem>
                  <MenuItem href="https://web3dao.notion.site/web3dao/Web3-Wiki-86f9cf927cbe49129d243dd66f27a638">
                    <div>
                      <Trans>Help Center</Trans>
                    </div>
                    <QuestionCircle opacity={0.6} />
                  </MenuItem>
                  <ToggleMenuItem onClick={() => setMenu('lang')}>
                    <div>
                      <Trans>Language</Trans>
                    </div>
                    <Globe opacity={0.6} />
                  </ToggleMenuItem>
                  <ToggleMenuItem onClick={() => toggleDarkMode()}>
                    <div>{darkMode ? <Trans>Light Theme</Trans> : <Trans>Dark Theme</Trans>}</div>
                    {darkMode ? <Moon opacity={0.6} size={16} /> : <Sun opacity={0.6} size={16} />}
                  </ToggleMenuItem>
                  <MenuItem href="https://web3dao.notion.site/web3dao/Web3-Wiki-86f9cf927cbe49129d243dd66f27a638">
                    <div>
                      <Trans>Docs</Trans>
                    </div>
                    <Book opacity={0.6} />
                  </MenuItem>
                  {/*<ToggleMenuItem onClick={() => togglePrivacyPolicy()}>
                    <div>
                      <Trans>Legal & Privacy</Trans>
                    </div>
                    <FileText opacity={0.6} size={16} />
                  </ToggleMenuItem>*/}
                </MenuFlyout>
              )
          }
        })()}
      </StyledMenu>
      <PrivacyPolicyModal />
    </>
  )
}

interface NewMenuProps {
  flyoutAlignment?: FlyoutAlignment
  ToggleUI?: React.FunctionComponent
  menuItems: {
    content: any
    link: string
    external: boolean
  }[]
}

const NewMenuFlyout = styled(MenuFlyout)`
  top: 3rem !important;
`
const NewMenuItem = styled(InternalMenuItem)`
  width: max-content;
  text-decoration: none;
`

const ExternalMenuItem = styled(MenuItem)`
  width: max-content;
  text-decoration: none;
`

export const NewMenu = ({ flyoutAlignment = FlyoutAlignment.RIGHT, ToggleUI, menuItems, ...rest }: NewMenuProps) => {
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.POOL_OVERVIEW_OPTIONS)
  const toggle = useToggleModal(ApplicationModal.POOL_OVERVIEW_OPTIONS)
  useOnClickOutside(node, open ? toggle : undefined)
  const ToggleElement = ToggleUI || StyledMenuIcon
  return (
    <StyledMenu ref={node as any} {...rest}>
      <ToggleElement onClick={toggle} />
      {open && (
        <NewMenuFlyout flyoutAlignment={flyoutAlignment}>
          {menuItems.map(({ content, link, external }, i) =>
            external ? (
              <ExternalMenuItem href={link} key={i}>
                {content}
              </ExternalMenuItem>
            ) : (
              <NewMenuItem to={link} key={i}>
                {content}
              </NewMenuItem>
            )
          )}
        </NewMenuFlyout>
      )}
    </StyledMenu>
  )
}