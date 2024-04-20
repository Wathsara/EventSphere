import React, { FunctionComponent, ReactElement } from "react";
import { Button, Layout, Carousel, theme, Card, Avatar, Rate, Row, Col } from 'antd';
const { Header, Content, Footer } = Layout;
const { Meta } = Card;
import logo from '../../images/logo.png';
import backgroundImg from '../../images/background.png';

const contentStyle = {
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
};

const bannerStyle = {
    position: 'relative',
    width: '100%',
    height: '550px',
    overflow: 'hidden'
};

const backgroundImageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: 0.8
};

const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    textAlign: 'center'
};

const typewriterStyle = {
    width: '100%',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 auto',
    borderRight: '2px solid white',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    animation: 'typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite'
};

const users = [
    { name: "Alice", rating: 4, review: "Platform is good", avatar: "https://api.dicebear.com/8.x/lorelei/svg" },
    { name: "Bob", rating: 5, review: "Platform is Awosome", avatar: "https://api.dicebear.com/8.x/bottts/png" },
    { name: "Carol", rating: 4, review: "Platform is Amazing", avatar: "https://api.dicebear.com/8.x/pixel-art/svg?seed=John&hair=short01,short02,short03,short04,short05" }
];

const cardStyle = {
    margin: '0 auto',  // Center the row if needed
    maxWidth: '1200px',  // Maximum width of the grid
    padding: '20px'  // Padding around the grid
};


const items = [{ key: 1, label: "nav 1" }]

export const HeaderMain: FunctionComponent = ({ onLoginClick }): ReactElement => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <Layout>
            <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={logo} alt="Logo" style={{ height: '32px', marginRight: '10px' }} />
                    <span style={{ color: 'white' }}>Conference Sphere</span>
                </div>
                <div>
                    <Button type="primary" style={{ marginRight: '15px' }} onClick={onLoginClick}>Sign In</Button>
                </div>
            </Header>
            <Content style={{ padding: '0 20px' }}>
                <div
                    style={{
                        background: colorBgContainer,
                        minHeight: 280,
                        padding: 24,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <div style={bannerStyle}>
                        <img src={backgroundImg} alt="Conference Background" style={backgroundImageStyle} />
                        <div style={overlayStyle}>
                            <div style={typewriterStyle}>
                                Conference Sphere: Explore. Connect. Discover.
                            </div>
                            <Button type="primary" style={{ marginTop: '20px' }} onClick={onLoginClick}>Join Us!</Button>
                        </div>
                    </div>
                    <Carousel autoplay>
                        <div>
                            <h3 style={contentStyle}>Explore. Connect. Discover. — Your Gateway to Global Research Events</h3>
                        </div>
                        <div>
                            <h3 style={contentStyle}>Unleashing Knowledge — Dive into the World's Leading Conferences and Journals</h3>
                        </div>
                        <div>
                            <h3 style={contentStyle}>Stay Ahead of the Curve — Join Today's Leading Research Conversations</h3>
                        </div>
                    </Carousel>
                    <div style={cardStyle}>
                        <Row gutter={16}>  {/* Provides spacing between columns */}
                            {users.map((user, index) => (
                                <Col key={index} xs={24} sm={12} lg={8}>  {/* Responsive column sizes */}
                                    <Card bordered={false} style={{ width: '100%', marginBottom: 16 }}>  {/* Set width to 100% for full column width usage */}
                                        <Meta
                                            avatar={<Avatar src={user.avatar} size={84} />}
                                            title={user.name}
                                            description={
                                                <>
                                                    <Rate disabled defaultValue={user.rating} />
                                                    <p>{user.review}</p>
                                                </>
                                            }
                                        />
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                Conference Sphere ©{new Date().getFullYear()} Created by WWD
            </Footer>
        </Layout>
    );
}