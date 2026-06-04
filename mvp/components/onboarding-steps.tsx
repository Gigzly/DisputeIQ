type Step = 1 | 2 | 3

interface Props {
  currentStep: Step
}

const STEPS = [
  { num: 1, label: 'Connect store',       desc: 'Shopify OAuth in 90 seconds' },
  { num: 2, label: 'Response generated',  desc: 'AI assembles evidence automatically' },
  { num: 3, label: 'Review & submit',     desc: 'Two minutes to win the dispute' },
]

export default function OnboardingSteps({ currentStep }: Props) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 14, padding: '20px 24px', marginBottom: 24 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
        Getting started — step {currentStep} of 3
      </div>
      <div style={{ display: 'flex', gap: 0, position: 'relative' }}>
        {/* connector line */}
        <div style={{ position: 'absolute', top: 14, left: 14, right: 14, height: 2, background: '#e8e8e8', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: 14, left: 14, width: `${((currentStep - 1) / 2) * 100}%`, height: 2, background: '#16a34a', zIndex: 1, transition: 'width .4s ease' }} />

        {STEPS.map(step => {
          const done    = step.num < currentStep
          const active  = step.num === currentStep
          const pending = step.num > currentStep
          return (
            <div key={step.num} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10,
                background: done ? '#16a34a' : active ? '#111827' : '#fff',
                border: `2px solid ${done ? '#16a34a' : active ? '#111827' : '#d1d5db'}`,
                color: done || active ? '#fff' : '#9ca3af',
                fontSize: 12, fontWeight: 700, transition: 'all .3s',
              }}>
                {done ? '✓' : step.num}
              </div>
              <div style={{ fontSize: 12, fontWeight: active ? 700 : 500, color: pending ? '#9ca3af' : '#111827', textAlign: 'center', lineHeight: 1.3 }}>
                {step.label}
              </div>
              <div style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', marginTop: 2, lineHeight: 1.4 }}>
                {step.desc}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
