import React from "react";

// ✅ FIXED IMPORTS
import OverBuying from "../assets/Problems.jpeg";
import Wastemoney from "../assets/wasted-money.jpg";
import Envimpact from "../assets/environment-impact.jpg";
import Hunger from "../assets/hunger.jpg";
import Resources from "../assets/resources.jpg";
import Community from "../assets/community.jpg";
import Sustainable from "../assets/sustainable.jpg";
import underline1 from "../assets/underline-heading.png";
import Arrow1 from "../assets/arrow1.png";
import Sun from "../assets/Highlight_05.png";

const Problems = () => {
  return (
    <div id="problems">
      <div className="the-problems">
        
        <div className="problems-section1">

          {/* ✅ HEADER */}
          <div className="heading-highlights">
            <img id="highlight-heading" src={Sun} alt="Sun" />

            <h1 id="heading-problems">
              Why Was FeedForward{" "}
              <span className="created">
                Created ?
                <img id="underline1" src={underline1} alt="underline" />
              </span>
            </h1>

            <img id="arrow1" src={Arrow1} alt="arrow" />
          </div>

          {/* ✅ CARDS */}
          <div className="cards">

            <div className="card1">
              <img src={Wastemoney} alt="Waste of money" />
              <h1>Wasted Money</h1>
              <p>
                Food waste results in significant financial losses. Around the world, 
                it is estimated that{" "}
                <span id="para-highlights">
                  we collectively waste ₹92,000 crores per annum on discarded food.
                </span>
              </p>
            </div>

            <div className="card2">
              <img src={Envimpact} alt="Environment impact" />
              <h1>Environmental Impact</h1>
              <p>
                Food waste contributes heavily to CO₂ emissions. Reducing waste helps
                protect the environment and reduce carbon footprint.
              </p>
            </div>

            <div className="card3">
              <img src={Hunger} alt="Hunger" />
              <h1>Fighting Hunger</h1>
              <p>
                While food is wasted, many people face hunger. Reducing waste can help
                provide meals to those in need.
              </p>
            </div>

            <div className="card4">
              <img src={Resources} alt="Resources" />
              <h1>Efficient Resource Use</h1>
              <p>
                Wasting food wastes water, energy, and land. Minimizing waste helps
                conserve these valuable resources.
              </p>
            </div>

            <div className="card5">
              <img src={Community} alt="Community" />
              <h1>Community Responsibility</h1>
              <p>
                Reducing food waste strengthens communities and promotes responsible
                behavior.
              </p>
            </div>

            <div className="card6">
              <img src={Sustainable} alt="Sustainable future" />
              <h1>Building a Sustainable Future</h1>
              <p>
                Addressing food waste helps build a more efficient and sustainable food
                system for everyone.
              </p>
            </div>

          </div>
        </div>

        {/* ✅ BACKGROUND IMAGE */}
        <div className="collage">
          <img id="background-image" src={OverBuying} alt="Overbuying" />
        </div>

      </div>
    </div>
  );
};

export default Problems;