import Mock from '../src/mock'

var expect = require('chai').expect

/** @test {Mock} */
describe('mock.js', function () {
  let mock
  const mockDir = './test/mock'
  beforeEach(() => {
    mock = new Mock({
      dir: mockDir
    })
  })

  /** @test {Mock#get} */
  it('[get] should allow to get options\' value', () => {
    expect(mock.get('some_key')).to.be.a('null')
    expect(mock.get('dir')).to.equal(mockDir)
  })

  /** @test {Mock#validate} */
  it('[validate] should validate options', () => {
    expect(mock.validate()).to.be.true
    mock = new Mock();
    expect(mock.validate()).to.be.false
  })

  /** @test {Mock#execute} */
  it('[execute] should execute request from mock file', (done) => {
    mock.execute('sample').then((response) => {
      try {
        expect(response.status).to.equal(200)
        expect(response.data).to.deep.equal([
          {id: 1, name: 'John'},
          {id: 2, name: 'Marry'}
        ])
        done()
      } catch (e) {
        done(e)
      }
    }).catch((error) => {
      done(error)
    })
  })
})
