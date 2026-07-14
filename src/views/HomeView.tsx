import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const steps = [
  {
    title: 'Step 1: Choose Your Template',
    description: 'Browse through our collection of ready-to-use templates.',
  },
  {
    title: 'Step 2: Customize It',
    description: 'Adjust the template to your needs with minimal effort.',
  },
  {
    title: 'Step 3: Launch',
    description: 'Deploy and launch your project in no time.',
  },
]

const features = [
  {
    title: '⚡ Open Source',
    description: 'Use it for free and contribute to the project.',
    image: 'https://placehold.co/400x200',
    alt: 'Open Source',
  },
  {
    title: '🎨 Free',
    description: 'Use even for commercial projects, no cost at all.',
    image: 'https://placehold.co/400x200',
    alt: 'Free',
  },
  {
    title: '🌙 Simplicity First',
    description: 'No experience needed. Just plug and play.',
    image: 'https://placehold.co/400x200',
    alt: 'Simplicity',
  },
  {
    title: '🚀 Fast Launch',
    description: 'Get projects off the ground with one command.',
    image: 'https://placehold.co/400x200',
    alt: 'Fast Launch',
  },
]

export default function HomeView() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b">
          <div className="container mx-auto flex flex-col-reverse items-center gap-12 px-4 py-16 lg:flex-row lg:justify-between lg:py-24">
            <div className="max-w-xl space-y-6 text-center lg:text-left">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Welcome to CLIuno Templates
              </h1>
              <p className="text-lg text-muted-foreground">
                The ultimate tool to make your journey in web development less painful.
              </p>
              <Button size="lg">Get Started</Button>
            </div>
            <img
              src="https://placehold.co/600x400/"
              className="w-full max-w-sm rounded-xl border shadow-sm"
              alt="Hero"
            />
          </div>
        </section>

        {/* Reset Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-14 max-w-2xl space-y-3 text-center">
              <h2 className="text-3xl font-bold tracking-tight">Reset Your Development Journey</h2>
              <p className="text-lg text-muted-foreground">
                Forget the confusion and complexity—use our templates to start your next project
                without the hassle.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {steps.map((step) => (
                <Card key={step.title}>
                  <CardHeader>
                    <CardTitle>{step.title}</CardTitle>
                    <CardDescription>{step.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <Card key={feature.title}>
                  <img src={feature.image} alt={feature.alt} className="w-full" />
                  <CardHeader>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
