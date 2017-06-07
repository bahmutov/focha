// example test set where last test fails
// Focha will run the last test first after
// running once (saves the order)

const passes = () => {}
const fails = () => {
  throw new Error('no')
}

it('A', passes)
it('B', passes)
it('C', passes)
it('D', fails)
