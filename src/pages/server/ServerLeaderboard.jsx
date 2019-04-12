import React, { Component } from "react"
import { backendUrl } from "../../Const"
import regeneratorRuntime from "regenerator-runtime"
import { PaddedCard } from "../../comp/Card"
import SideCard from "../../comp/profile/SideCard"
import FlexPadder from "../../comp/FlexPadder"
import Grid, { ProfileGrid } from "../../comp/GridContainer"
import { SmallIcon } from "../../comp/profile/Icon"
import NavLink from "../../comp/NavLink"
import { darkBackground, brandBackground, lightBackground } from "../../comp/Utils"
import lookupBackground from "../../Backgrounds"

import styled from "@emotion/styled"
import Axios from "axios";
import $ from "../../Translate";
import Container from "../../comp/Container"
import storage from "../../Storage"
import getTheme from "../../Theme"

const LeaderboardGrid = styled(Grid)`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: fit-content(80px);
  grid-column-gap: 2em;
  grid-row-gap: 2em;
  grid-auto-rows: fit-content(80px);
`
const SideGrid = styled(Grid)`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: fit-content(16em);
  grid-column-gap: 2em;
  grid-row-gap: 2em;
  grid-auto-rows: fit-content(16em);
`

export default class extends Component {
  render() {
    return (
      <Container>
        <ProfileGrid>
          <SideGrid>
            <SideCard>
              <h3>{$("en_US", "levels.role-rewards")}</h3>
              {this.renderRewards()}
            </SideCard>
            <SideCard>
              <h3>{$("en_US", "levels.how-it-works")}</h3>
              <p>{$("en_US", "levels.exp-gain")}</p>
              <p>{$("en_US", "levels.view-rank").replace("$prefix", this.props.prefix)}</p>
            </SideCard>
          </SideGrid>
          <LeaderboardGrid>
            {this.renderCards()}
          </LeaderboardGrid>
        </ProfileGrid>
      </Container>
    )
  }

  renderRewards() {
    if(this.props.rewards.length == 0) {
      return (
        <div>
          {$("en_US", "levels.no-rewards")}
        </div>
      )
    } else {
      return (
        <div>
          TODO: Fill this out...
        </div>
      )
    }
  }

  renderCards() {
    const cards = []
    let key = 0
    this.props.leaderboard.forEach(e => {
      const levelProgress = e.nextLevelXp - e.currentLevelXp - e.xpNeeded
      const levelTotal = e.userXp - e.currentLevelXp + e.xpNeeded
      const background = lookupBackground(e.customBackground)
      const FilledRankCard = styled(RankCard)`
        background: linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url("${background}") center / cover;
      `
      const dashOffset = 200.96 * (1 - (levelProgress / levelTotal))
      const theme = getTheme(storage.getLightTheme())
      cards.push(
        <FilledRankCard key={key++}>
          <RankNumber>
            #{e.playerRank}
          </RankNumber>
          <IconWrapper>
            <SmallIcon src={e.avatar} alt="avatar" />
          </IconWrapper>
          <span style={{marginLeft: "0.5em"}} />
          <NameText>
            <span>{e.name}</span><span>#{e.discrim}</span>
          </NameText>
          <ProgressBarBase>
            <ProgressBarText>
              {levelProgress} / {levelTotal} EXP
              <FlexPadder />
              Level {e.userLevel}
            </ProgressBarText>
            <ProgressBar percent={levelProgress / levelTotal} />
          </ProgressBarBase>
          <ProgressBarMobile>
            <ProgressBarCircle>
              <circle cx={32} cy={32} r='28' fill="none" stroke={theme.colors.dark} strokeWidth="4" />
              <circle cx={-32} cy={32} r='28' fill="none" stroke={theme.colors.brand} strokeWidth="4"
                strokeDasharray="200.96" strokeDashoffset={dashOffset} transform="rotate(-90)" />
            </ProgressBarCircle>
            <ProgressBarMobileText>
              LVL<br />
              {e.userLevel}
            </ProgressBarMobileText>
          </ProgressBarMobile>
        </FilledRankCard>
      )
    })
    return cards
  }
}

const IconWrapper = styled.div`
  width: 64px;
  height: 64px;
`
const NameText = styled.div`
  width: 50%;
`
const RankCard = styled(PaddedCard)`
  display: flex;
  flex-direction: row;
  align-content: center;
  align-items: center;
`
const RankNumber = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  border-radius: 50%;
  padding: 0.5em;
  margin-right: 0.5em;
  ${lightBackground}
`
const ProgressBarBase = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-left: 0.5em;
  padding-right: 0.5em;

  @media screen and (max-width: 768px) {
    display: none !important;
  }
`
const ProgressBarText = styled.div`
  display: flex;
  flex-direction: row;
`
const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  border-radius: 2px;
  ${darkBackground}

  &:after {
    content: ' ';
    display: block;
    width: calc(100% * ${props => props.percent});
    height: 4px;
    border-radius: 2px;
    ${brandBackground};
  }
`
const ProgressBarMobile = styled.div`
  @media screen and (max-width: 768px) {
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: center;
    text-align: center;
    position: relative;
    width: 64px;
    height: 64px;
  }
  @media screen and (min-width: 769px) {
    display: none;
  }
`
const ProgressBarCircle = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 64px;
  height: 64px;
`
const ProgressBarMobileText = styled.div`
  position: absolute;
  top: 32;
  left: 32;
`