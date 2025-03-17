import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface ShowdownEmailProps {
  username?: string
  updateLink?: string
  flightInfoLink?: string
  leaderboardLink?: string
}

export const ShowdownEmail = ({
  username = '',
  updateLink = '',
  flightInfoLink = 'https://www.showdown.warner.systems/flights',
  leaderboardLink = 'https://www.showdown.warner.systems/scoreboard',
}: ShowdownEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        {username}, please confirm your details for Saturday's event
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={section}>
            <Text style={text}>Hi {username},</Text>
            <Text style={text}>
              Just a quick reminder that you're scheduled to participate in
              Showdown V this Saturday (22nd).
            </Text>
            <Text style={text}>
              Could you please take a moment to verify your lift openers, and
              personal bests? This will help us ensure everything runs smoothly
              on the day.
              <Text style={smtext}>
                (you can update this as many times as you like)
              </Text>
            </Text>

            <Text style={actionText}>
              <Link
                style={textLink}
                href={`https://www.showdown.warner.systems/user${updateLink}`}
              >
                Please verify your information here →
              </Link>
            </Text>
          </Section>

          <Section style={section}>
            <Text style={text}>On Saturday, you'll be able to:</Text>
            <Text style={linkText}>
              • Check when you're lifting:{' '}
              <Link
                style={textLink}
                href={flightInfoLink}
              >
                View flight schedule
              </Link>
            </Text>
            <Text style={linkText}>
              • Track results in real-time:{' '}
              <Link
                style={textLink}
                href={leaderboardLink}
              >
                Access live scoreboard
              </Link>
            </Text>
          </Section>

          <Section style={section}>
            <Text style={text}>Looking forward to seeing you there!</Text>
            <Text style={signature}>- The CE Team</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default ShowdownEmail

// Styles
const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
}


const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '24px',
}

const section = {
  padding: '0 48px',
}

const text = {
  color: '#333',
  fontSize: '16px',
  fontWeight: '400',
  lineHeight: '24px',
  margin: '16px 0',
}
const smtext = {
  color: '#333',
  fontSize: '12px',
  fontWeight: '400',
  lineHeight: '24px',
  margin: '0px 0',
}

const actionText = {
  margin: '24px 0',
  fontSize: '16px',
}

const linkText = {
  color: '#333',
  fontSize: '16px',
  fontWeight: '400',
  lineHeight: '24px',
  margin: '8px 0',
}

const textLink = {
  color: '#0070f3',
  textDecoration: 'underline',
}

const signature = {
  color: '#333',
  fontSize: '16px',
  fontWeight: '400',
  margin: '24px 0 8px',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  marginTop: '48px',
  padding: '0 48px',
}

const footerText = {
  color: '#8898aa',
  fontSize: '12px',
  margin: '0',
  textAlign: 'center' as const,
}
