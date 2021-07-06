import React from 'react'

const Home = () => {
    return (
        <div class="px-4 py-5 my-5 text-center">
    <i class="fas fa-chart-pie" style={{fontSize : 60}}></i>
    <h1 class="display-5 fw-bold">openAnalytics</h1>
    <div class="col-lg-6 mx-auto">
      <p class="lead mb-4">An open source analytics tool that lets you collect all the information you need. Including events, page views, ip logging, and more.</p>
      <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
        <button type="button" class="btn btn-primary btn-lg px-4 gap-3">Primary button</button>
        <button type="button" class="btn btn-outline-secondary btn-lg px-4">Secondary</button>
      </div>
    </div>
  </div>
    )
}

export default Home
