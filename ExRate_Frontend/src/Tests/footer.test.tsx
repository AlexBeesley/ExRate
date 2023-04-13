import { describe, expect, it } from 'vitest';
import { render, screen } from '../Utilities/test-utils';
import Footer from '../Components/Footer';

describe('Footer', () => {
  render(
    <Footer/>
  )
  
  it('Footer is rendered', () => {
    expect(screen.getByText(/Alexander Beesley/i)).toBeInTheDocument()
  })
})