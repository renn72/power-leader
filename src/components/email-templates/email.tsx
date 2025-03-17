import {
  Body,
  Button,
  Container,
  Head,
  Heading,
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
      <Preview>Showdown V, Important information</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Showdown V</Heading>

          <Section style={section}>
            <Text style={text}>Hey {username},</Text>
            <Text style={text}>
              Showdown V is coming up this weekend on the 22nd.
            </Text>
            <Text style={text}>
              If you get a chance, log into our app and update your
              lift openers, rack heights and PB's (you can update this as many
              times as you like).
            </Text>

            <Button
              style={button}
              href={ `https://www.showdown.warner.systems/user` + updateLink}
            >
              Update Your Profile
            </Button>
          </Section>

          <Section style={section}>
            <Text style={text}>Also on competition day you can:</Text>
            <Text style={linkText}>
              •{' '}
              <Link
                style={link}
                href={flightInfoLink}
              >
                View your flight information
              </Link>
            </Text>
            <Text style={linkText}>
              •{' '}
              <Link
                style={link}
                href={leaderboardLink}
              >
                See the live leaderboard
              </Link>
            </Text>
          </Section>

          <Section style={section}>
            <Text style={text}>See you this weekend!</Text>
            <Text style={signature}>The CE Team</Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              © 2025 WS. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default ShowdownEmail

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  borderRadius: '5px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
}

const h1 = {
  color: '#000',
  fontSize: '32px',
  fontWeight: '700',
  margin: '40px 0',
  padding: '0',
  lineHeight: '42px',
  textAlign: 'center' as const,
}

const section = {
  padding: '0 48px',
}

const text = {
  color: '#333',
  fontSize: '16px',
  fontWeight: '400',
  lineHeight: '26px',
  margin: '16px 0',
}

const linkText = {
  color: '#333',
  fontSize: '16px',
  fontWeight: '400',
  lineHeight: '26px',
  margin: '8px 0',
}

const button = {
  backgroundColor: '#000',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 24px',
  width: '230px',
  margin: '32px auto',
}

const link = {
  color: '#067df7',
  textDecoration: 'underline',
}

const signature = {
  color: '#333',
  fontSize: '16px',
  fontWeight: '600',
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
