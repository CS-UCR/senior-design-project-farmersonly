import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import Link from "@mui/material/Link";

import styles from "../styles/about.module.css";

export default function about() {
  return (
    <div className={styles.container}>
      <div className={styles.about}>
        <h1 className={styles.aboutTitle}>About</h1>

        <div className={styles.aboutText}>
          <div>
            In collaboration with Dr. Akansha Garg, from The Hanghverdi Water
            Management Group, the Irrigation Water Management Tool Suite(IWO
            Tool Suit) is designed to help farmers make better decisions about
            their farms and harvest. These tools main goals are to tackle
            California's water scarcity problems and increase farming
            productivity.
          </div>
          <br />
          <div>
            The Samz Dessert Tool is works on agricultural management zones
            based on NDVI satellite data in order to devleop optimize
            agricultural management zones and crop production. After uploading
            NDVI data, processing will compute the mean, min, max, range, and
            std of data, performace graph, zone delineation, and field
            recommendation.
          </div>
        </div>
      </div>

      <div className={styles.team}>
        <h1 className={styles.teamTitle}>The Team</h1>

        <div>
          <h2 className={styles.cardsTitle}>Team Advisors</h2>

          <Grid
            container
            justifyContent="center"
            columnSpacing={2}
            rowSpacing={3}
          >
            <Grid item>
              <Card
                variant="outlined"
                sx={{ minWidth: 275 }}
                style={{
                  backgroundColor: "#0F4C75",
                  color: "#BBE1FA",
                  textAlign: "center",
                }}
              >
                <CardContent>
                  <Typography>Mariam Salloum</Typography>
                  <Typography sx={{ fontSize: 13 }}>
                    Assistant Teaching Professor
                  </Typography>
                  <Link href="https://www.linkedin.com/in/mariamsalloum/">
                    <LinkedInIcon />
                  </Link>
                </CardContent>
              </Card>
            </Grid>

            <Grid item>
              <Card
                variant="outlined"
                sx={{ minWidth: 275 }}
                style={{
                  backgroundColor: "#0F4C75",
                  color: "#BBE1FA",
                  textAlign: "center",
                }}
              >
                <CardContent>
                  <Typography>Akansha Garg</Typography>
                  <Typography sx={{ fontSize: 13 }}>
                    Postdoctoral Research Associate
                  </Typography>
                  <Link href="https://www.linkedin.com/in/akanksha-garg-ph-d-2025b417/">
                    <LinkedInIcon />
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>

        {
          <div>
            <h2 className={styles.cardsTitle}>Development Team</h2>

            <Grid
              container
              justifyContent="center"
              columnSpacing={2}
              rowSpacing={3}
            >
              <Grid item>
                <Card
                  variant="outlined"
                  sx={{ minWidth: 275 }}
                  style={{
                    backgroundColor: "#0F4C75",
                    color: "#BBE1FA",
                    textAlign: "center",
                  }}
                >
                  <CardContent>
                    <Typography>Sebastian Garcia</Typography>
                    <Typography sx={{ fontSize: 13 }}>Undergraute</Typography>
                    <Link href="https://www.linkedin.com/in/sebastian-garcia-ca/">
                      <LinkedInIcon />
                    </Link>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item>
                <Card
                  variant="outlined"
                  sx={{ minWidth: 275 }}
                  style={{
                    backgroundColor: "#0F4C75",
                    color: "#BBE1FA",
                    textAlign: "center",
                  }}
                >
                  <CardContent>
                    <Typography>Robert Navarro</Typography>
                    <Typography sx={{ fontSize: 13 }}>Undergraute</Typography>
                    <Link href="https://www.linkedin.com/in/robert-navarro25/">
                      <LinkedInIcon />
                    </Link>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item>
                <Card
                  variant="outlined"
                  sx={{ minWidth: 275 }}
                  style={{
                    backgroundColor: "#0F4C75",
                    color: "#BBE1FA",
                    textAlign: "center",
                  }}
                >
                  <CardContent>
                    <Typography>Daniel Nissan</Typography>
                    <Typography sx={{ fontSize: 13 }}>Undergraute</Typography>
                    <Link href="https://www.linkedin.com/in/danielnis/">
                      <LinkedInIcon />
                    </Link>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item>
                <Card
                  variant="outlined"
                  sx={{ minWidth: 275 }}
                  style={{
                    backgroundColor: "#0F4C75",
                    color: "#BBE1FA",
                    textAlign: "center",
                  }}
                >
                  <CardContent>
                    <Typography>Juan Castellon</Typography>
                    <Typography sx={{ fontSize: 13 }}>Undergraute</Typography>
                    <Link href="https://www.linkedin.com/in/juan-castellon-0320a8206/">
                      <LinkedInIcon />
                    </Link>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </div>
        }
      </div>
    </div>
  );
}
